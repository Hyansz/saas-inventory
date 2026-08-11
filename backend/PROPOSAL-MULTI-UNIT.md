# Proposal: Sistem Multi-Satuan (Unit of Measure) + Stock Opname

> Dokumen ini murni desain — belum ada kode yang diubah. Implementasi dilakukan bertahap setelah disetujui.

## A. Hasil Investigasi Kondisi Saat Ini

### 1. Alur logic `InventoryService` (backend/app/Services/InventoryService.php)

- **currentStock(Item)** — stok = `SUM(inventory_transactions.qty)` dengan `type='IN'` positif, `type='OUT'` negatif (ledger-based, baris 19-33).
- **createStockIn($data)** — dalam 1 DB transaction: buat `InventoryTransaction` (type `IN`, qty) lalu buat `StockIn` dengan `transaction_id` yang sama (baris 41-57).
- **createStockOut($data)** — cek `currentStock >= qty` (kalau kurang `abort(422, 'Stok tidak mencukupi')`), lalu buat `InventoryTransaction` (type `OUT`) + `StockOut` (baris 108-130).
- **updateStockIn/updateStockOut** — update transaksi ledger + record; validasi stok di update StockOut: `currentStock + qty_lama >= qty_baru` (baris 145-149).
- **deleteStockIn/deleteStockOut** — hapus transaksi ledger (via relasi `transaction_id`) + record.

Kesimpulan: **stok adalah hasil kalkulasi dari ledger, tidak disimpan sebagai kolom**, dan seluruh qty dianggap satu satuan polos tanpa metadata unit.

### 2. Skema database saat ini (tidak ada kolom satuan sama sekali)

| Tabel | Kolom | Keterangan |
|---|---|---|
| `items` | id, category_id, `kode_barang` (unique), `nama_barang`, `stok_minimal`, deskripsi, timestamps | **tidak ada kolom satuan** |
| `stock_ins` | id, transaction_id, item_id, qty (integer), supplier, tanggal, user_id | **tidak ada kolom satuan** |
| `stock_outs` | id, transaction_id, item_id, qty (integer), tujuan, tanggal, user_id | **tidak ada kolom satuan** |
| `inventory_transactions` | id, item_id, type enum(`IN`,`OUT`), qty (integer), tanggal, keterangan | **tidak ada kolom satuan** |
| `stock_movements` | id, item_id, type enum(`in`,`out`), quantity | **tabel mati** — dibuat 2026_06_19 tapi tidak dipakai model/controller mana pun |

### 3. Model & relasi

- `Item` — fillable tanpa unit; `$appends` `total_stock` & `current_stock` dihitung dari `withSum('stockIns','qty')` dan `withSum('stockOuts','qty')` (dipanggil di ItemController::index). Relasi: category, stockIns, stockOuts, transactions.
- `StockIn` / `StockOut` — belongsTo item, user, transaction. Cast `tanggal` ke date.
- `InventoryTransaction` — belongsTo item; hasOne stockIn / stockOut (lewat `transaction_id`).

### 4. Frontend (form input)

- `components/stock-in/add-stock-in-modal.tsx` & `edit-stock-in-modal.tsx` — field: item_id (dropdown nama_barang), qty (number polos), supplier, tanggal. **Tidak ada field satuan.**
- `components/stock-out/add-stock-out-modal.tsx` & `edit-stock-out-modal.tsx` — field: item_id, qty, tujuan, tanggal. **Tidak ada field satuan.**
- `components/items/add-item-modal.tsx` — category_id, kode_barang, nama_barang, stok_minimal, deskripsi. **Tidak ada field satuan.**
- Payload API via `services/stock-in.ts` / `stock-out.ts` — `{ item_id, qty, supplier/tujuan, tanggal }`; qty dikirim sebagai Number.
- Validasi backend: `'qty' => 'required|integer|min:1'` di StockInController & StockOutController.

### 5. Indikasi satuan di nama barang

- Tidak ada referensi "karton/pcs/box/satuan/unit" di seluruh kode backend (satu-satunya match di CSS minified welcome.blade.php — tidak relevan).
- Seeder hanya membuat user, tidak ada data barang. Karena sistem belum punya kolom satuan, **semua qty historis dianggap satu satuan dasar yang sama** — asumsi ini harus dikonfirmasi user sebelum implementasi (lihat bagian F).

---

## B. Desain Skema Database Baru

### B.1 Tabel `item_units` (satuan per barang + konversi ke satuan dasar)

```
item_units
├── id              PK
├── item_id         FK → items.id (cascadeOnDelete)
├── nama_unit       string   ("pcs", "karton", "box", "lusin", ...)
├── konversi        decimal(12,4)   → 1 unit ini = X satuan dasar
├── is_base         boolean   → true untuk satuan dasar (konversi harus 1)
├── timestamps
└── UNIQUE(item_id, nama_unit)
```

Contoh untuk item "Indomie Goreng": `pcs` (base, 1), `box` (1 box = 10 pcs), `karton` (1 karton = 40 pcs).

### B.2 Kolom baru di tabel existing (semua nullable → backward compatible)

| Tabel | Kolom baru | Tipe | Makna |
|---|---|---|---|
| `items` | `satuan_dasar_id` | FK nullable → `item_units.id` | satuan dasar item (referensi cepat untuk display) |
| `stock_ins` | `unit_id` | FK nullable → `item_units.id` | satuan yang dipakai user saat input |
| `stock_ins` | `qty_unit` | decimal(12,4) nullable | qty persis seperti yang diketik user |
| `stock_outs` | `unit_id` | FK nullable → `item_units.id` | satuan yang dipakai user saat input |
| `stock_outs` | `qty_unit` | decimal(12,4) nullable | qty persis seperti yang diketik user |
| `inventory_transactions` | `unit_id` | FK nullable → `item_units.id` | satuan asal input (untuk audit/reporting) |

Aturan penyimpanan:
- `stock_ins.qty` / `stock_outs.qty` / `inventory_transactions.qty` **tetap integer = satuan dasar** (satu sumber kebenaran).
- `qty_unit` menyimpan angka asli yang diketik user + `unit_id` menyimpan satuan yang dipilih — murni untuk auditabilitas (histori "10 karton masuk" tetap terbaca 10 karton, bukan cuma 400 pcs).
- Untuk baris lama: `unit_id = NULL` dan `qty_unit = qty` (dianggap satuan dasar).

### B.3 Konversi

```
qty_base = round(qty_unit * konversi)   // wajib integer
```

- `inventory_transactions.qty` selalu dalam satuan dasar. Contoh: stock in 10 karton (1 karton = 40 pcs) → ledger mencatat `qty = 400`, `unit_id = karton`, `qty_unit = 10`.
- Validasi saat input: hasil konversi harus integer dan `>= 1` (kalau pecahan, reject — mis. 0.3 pcs dari karton berisi 40 → 12 pcs? Boleh: 0.3*40 = 12, integer, valid).

### B.4 Tabel Stock Opname (fitur baru)

```
stock_opnames                    // header 1 opname = 1 periode hitung fisik
├── id
├── tanggal          date
├── user_id          FK → users.id  (yang membuat/menyetujui)
├── catatan          text nullable
├── status           string   draft | completed
└── timestamps

stock_opname_items               // detail per barang
├── id
├── stock_opname_id  FK → stock_opnames.id (cascadeOnDelete)
├── item_id          FK → items.id
├── qty_sistem       integer   snapshot stok sistem saat opname dibuat (tidak berubah walau transaksi lain masuk)
├── qty_fisik        integer   hasil hitung fisik user
├── selisih          integer   qty_fisik - qty_sistem
├── unit_id          FK → item_units.id   (satuan input hitung fisik, default satuan dasar)
└── UNIQUE(stock_opname_id, item_id)
```

`inventory_transactions` juga ditambah kolom `opname_item_id` (FK nullable → `stock_opname_items.id`) supaya transaksi adjustment bisa dilacak balik ke baris opname.

---

## C. Perubahan `InventoryService`

### C.1 Helper baru

- `Item::units()` relasi hasMany ke `item_units`; `Item::satuanDasar()` mengambil unit dengan `is_base = true`.
- `InventoryService::convertToBase(Item $item, ItemUnit $unit, float $qtyUnit): int` — kalkulasi + validasi integer (`throw ValidationException` kalau hasil pecahan atau <= 0).
- `InventoryService::resolveUnit(Item $item, ?int $unitId): ItemUnit` — kalau `unit_id` null → satuan dasar (default; penting untuk kompatibilitas API lama).

### C.2 createStockIn / updateStockIn

```
1. resolve unit (default satuan dasar)
2. qty_base = convertToBase(item, unit, qty_unit)     // input API: qty_unit + unit_id (opsional)
3. validasi: unit_id harus milik item tsb (exists di item_units item ini)
4. InventoryTransaction::create(qty = qty_base, unit_id, ...)
5. StockIn::create(qty = qty_base, qty_unit, unit_id, ...)
```

### C.3 createStockOut / updateStockOut

```
1-3. sama seperti di atas (konversi dulu SEBELUM cek stok)
4. cek currentStock >= qty_base (422 'Stok tidak mencukupi' — perilaku lama dipertahankan)
5. buat transaction OUT + StockOut seperti sekarang
```

Update StockOut: `available = currentStock + qty_base_lama` lalu bandingkan dengan `qty_base_baru` (logika yang sudah ada, hanya base unit).

### C.4 API Contract

- Request stock-in/out: `{ item_id, qty (satuan dasar, backward compatible), qty_unit?, unit_id? }`. Jika `qty_unit` + `unit_id` tidak dikirim → dianggap satuan dasar (`qty` dipakai langsung, perilaku API lama identik).
- Response: tambah `unit` object + `qty_unit` di `StockIn`/`StockOut` dan `item.satuan_dasar`.
- Validasi controller: `'qty' => 'required|numeric|min:1'` (boleh desimal sekarang), `'unit_id' => 'nullable|exists:item_units,id'`.

### C.5 Impact ke kode lain

- `Item::current_stock` / `total_stock` (via withSum) tetap valid karena semua qty di ledger sudah satuan dasar.
- `DashboardController`, `ReportController`, `AnalyticsController`, `TransactionController` tidak perlu diubah logikanya — hanya perlu menampilkan label satuan (append `satuan_dasar` di response item).

---

## D. Desain Fitur Stock Opname

### D.1 Alur user (frontend)

1. Admin buka menu baru **"Stock Opname"** → klik "Buat Opname" → pilih tanggal, sistem me-list semua item dengan **`qty_sistem` = snapshot `InventoryService::currentStock(item)` saat itu** (draft, bisa disimpan).
2. Admin menghitung fisik di gudang, lalu isi **`qty_fisik`** per item (input numerik + dropdown satuan, default satuan dasar; kalau pilih karton otomatis terkonversi ke pcs saat disimpan).
3. Klik "Simpan & Selesaikan" → sistem menghitung `selisih = qty_fisik - qty_sistem` per item.
4. Untuk item dengan `selisih != 0`, sistem otomatis membuat **transaksi ADJUSTMENT terpisah** di ledger — TIDAK mengedit transaksi lama:
   - `selisih > 0` → `InventoryTransaction(type='IN', qty=selisih, keterangan="Adjustment Opname #<id>: <nama_barang>", opname_item_id=...)`
   - `selisih < 0` → `InventoryTransaction(type='OUT', qty=abs(selisih), keterangan="Adjustment Opname #<id>: <nama_barang>", opname_item_id=...)`
   - `selisih == 0` → tidak ada transaksi.
5. Satu proses selesai dalam 1 DB transaction (opname status `completed` + semua adjustment + update stock).

### D.2 Alasan desain "adjustment terpisah"

- Ledger bersifat append-only: stok sistem = SUM ledger, sehingga adjustment berbasis transaksi otomatis tercermin di `currentStock` tanpa kode khusus di mana pun.
- Audit trail lengkap: transaksi adjustment bisa ditelusuri ke `stock_opname_items` (relasi `opname_item_id`), lengkap dengan siapa (user_id opname), kapan (tanggal), dan selisih berapa.
- Tidak perlu mengubah enum `type` di `inventory_transactions` (tetap IN/OUT) → tidak perlu ALTER enum di Postgres.

### D.3 Backend baru

- Model: `StockOpname`, `StockOpnameItem`, `ItemUnit` (+ relasi `opnameItem` di InventoryTransaction).
- Controller baru: `Api\StockOpnameController` (apiResource + endpoint `POST /stock-opnames/{id}/complete` untuk langkah finalisasi).
- Routes baru di `api.php` dalam group `role:admin,super_admin`: `/stock-opnames`, `/stock-opnames/{id}/complete`.
- Validasi: `qty_fisik >= 0` (boleh 0 — barang hilang/habis).

---

## E. Perubahan Frontend (level komponen)

### E.1 Form stock-in & stock-out (existing)

- `add-stock-in-modal.tsx` / `add-stock-out-modal.tsx` (+ edit): tambah **dropdown "Satuan"** di samping field qty. Dropdown berisi `item_units` dari item terpilih (dimuat via response `/items` yang sudah include `units` atau endpoint baru `/items/{id}/units`).
- Saat item/qty/satuan berubah → tampilkan preview konversi: "10 karton = 400 pcs" sebelum submit.
- Payload: tambah `unit_id` + `qty_unit` (qty tetap dikirim sebagai qty_unit).
- Tabel stock-in/out & transaction: tampilkan label satuan di kolom qty (mis. "400 pcs").

### E.2 Form item (existing)

- `add-item-modal.tsx` / `edit-item-modal.tsx`: tambah blok **"Satuan Barang"** — input baris dinamis: nama satuan + nilai konversi, dengan wajib minimal 1 satuan dasar (radio "jadikan dasar"). Contoh: pcs (dasar), box = 10, karton = 40.

### E.3 Fitur Stock Opname (baru)

- Page baru `frontend/app/(dashboard)/stock-opname/page.tsx` + entry di sidebar (`components/layout/sidebar.tsx`).
- Komponen baru di `components/stock-opname/`:
  - `opname-table.tsx` — daftar opname (tanggal, jumlah item, status, selisih total).
  - `create-opname-modal.tsx` — pilih tanggal → buat draft.
  - `opname-detail-page` (atau sheet/dialog) — tabel item: qty_sistem (readonly), qty_fisik (input), selisih (auto), tombol "Selesaikan".
- Service baru `frontend/services/stock-opname.ts` (mirip pola `stock-in.ts`).

---

## F. Strategi Migrasi Data (production sudah ada data)

### F.1 Prinsip

- **Semua migration additive** (add column nullable / create table) — tidak ada drop/alter destruktif → aman dijalankan di Neon tanpa downtime.
- Migration baru (urutan):
  1. `create_item_units_table`
  2. `add_satuan_dasar_to_items` (nullable FK)
  3. `add_unit_columns_to_stock_tables` (unit_id + qty_unit nullable)
  4. `add_opname_item_id_to_inventory_transactions` + tabel opname
- Tabel `stock_movements` (mati) dibiarkan — tidak dipakai; opsional dihapus di cleanup terpisah.

### F.2 Backfill data lama (satu kali, lewat artisan command `php artisan inventory:backfill-units`)

1. Untuk setiap item existing: buat `item_units` baris satuan dasar (`nama_unit = "pcs"` default, `konversi = 1`, `is_base = true`), set `items.satuan_dasar_id`.
2. Backfill `stock_ins` / `stock_outs`: `unit_id = satuan dasar item`, `qty_unit = qty`.
3. Ledger (`inventory_transactions`) tidak disentuh — qty historis memang sudah satuan dasar (dianggap), sehingga **currentStock semua item tidak berubah**.

### F.3 Konfirmasi yang diperlukan user sebelum implementasi

1. Benarkah semua data historis (stock-in/out) selama ini dicatat dalam satuan yang sama (mis. pcs)? Kalau ada barang yang selama ini dicatat "karton" sebagai 1 karton = 1, konversi default harus disesuaikan per item saat backfill.
2. Apakah ada nama barang yang sudah mengandung satuan (mis. "Indomie Goreng (Karton)")? Kalau ada: opsi (a) biarkan nama, buat item_units dengan karton sebagai satuan dasar, atau (b) bersihkan nama via command sekali jalan (opsional).
3. Kebijakan stok opname: adjustment boleh minus (barang hilang/rusak) — konfirmasi siapa saja role yang boleh buka menu opname (diusulkan admin + super_admin).

### F.4 Urutan deploy ke production (Render + Neon)

1. `git push` backend → `php artisan migrate --force` (deploy hook atau via script deploy) → `php artisan inventory:backfill-units`.
2. Verifikasi stok dashboard tidak berubah sebelum/ sesudah backfill.
3. Deploy frontend.
4. Test: input stock-in 10 karton → cek ledger 400 pcs → stock out 1 karton + 12 pcs → sisa benar → buat opname → cek adjustment.

---

## G. Ringkasan File yang Dibuat/Diubah (saat implementasi nanti)

**Backend baru:** `app/Models/ItemUnit.php`, `app/Models/StockOpname.php`, `app/Models/StockOpnameItem.php`, `app/Http/Controllers/Api/StockOpnameController.php`, `app/Console/Commands/BackfillUnits.php`, migration (5 file), `routes/api.php` (tambah route).

**Backend diubah:** `app/Services/InventoryService.php` (konversi di create/update stock in/out), `app/Models/Item.php` (relasi units, satuanDasar, append `satuan_dasar` label), `StockIn.php`, `StockOut.php`, `InventoryTransaction.php`, `ItemController.php`, `StockInController.php`, `StockOutController.php` (validasi unit).

**Frontend baru:** `app/(dashboard)/stock-opname/page.tsx`, `components/stock-opname/*` (3-4 file), `services/stock-opname.ts`.

**Frontend diubah:** add/edit modal stock-in, add/edit modal stock-out, add/edit modal item, tabel stock-in/out/transactions/items, `sidebar.tsx` (menu baru), `services/stock-in.ts` & `stock-out.ts`.

**Tidak diubah:** logika inti `UserSeeder`/`DatabaseSeeder`, skema tabel existing yang sudah ada (hanya ditambah kolom nullable), struktur response API yang dipakai laporan.
