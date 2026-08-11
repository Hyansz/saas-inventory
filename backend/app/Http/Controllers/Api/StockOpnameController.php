<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\StockOpname;
use App\Models\StockOpnameItem;
use App\Services\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockOpnameController extends Controller
{
    private function ensureAdmin()
    {
        if (!in_array(auth()->user()->role, ['admin', 'super_admin'])) {
            abort(403, 'Akses ditolak');
        }
    }

    public function index()
    {
        $opnames = StockOpname::with('user')
            ->withCount('items')
            ->latest()
            ->paginate(10);

        $opnames->statistics = [
            'total' => StockOpname::count(),
            'completed' => StockOpname::where('status', 'completed')->count(),
            'draft' => StockOpname::where('status', 'draft')->count(),
        ];

        return response()->json($opnames);
    }

    public function store(Request $request)
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'tanggal' => 'required|date',
            'catatan' => 'nullable|string',
        ]);

        $opname = DB::transaction(function () use ($validated) {

            $opname = StockOpname::create([
                'tanggal' => $validated['tanggal'],
                'user_id' => auth()->id(),
                'status' => 'draft',
                'catatan' => $validated['catatan'] ?? null,
            ]);

            foreach (Item::all() as $item) {
                StockOpnameItem::create([
                    'stock_opname_id' => $opname->id,
                    'item_id' => $item->id,
                    'qty_sistem' => InventoryService::currentStock($item),
                ]);
            }

            return $opname;
        });

        return response()->json([
            'message' => 'Stock opname berhasil dibuat',
            'data' => $opname->load(['items']),
        ], 201);
    }

    public function show(StockOpname $stockOpname)
    {
        return response()->json(
            $stockOpname->load([
                'user',
                'items.item.units',
                'items.unit',
            ])
        );
    }

    public function complete(Request $request, StockOpname $stockOpname)
    {
        $this->ensureAdmin();

        if ($stockOpname->status === 'completed') {
            abort(422, 'Opname sudah diselesaikan');
        }

        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.stock_opname_item_id' => ['required', 'integer', 'exists:stock_opname_items,id'],
            'items.*.qty_fisik' => ['required', 'integer', 'min:0'],
            'items.*.alasan' => ['nullable', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($stockOpname, $validated) {

            foreach ($validated['items'] as $entry) {

                $opnameItem = StockOpnameItem::where('id', $entry['stock_opname_item_id'])
                    ->where('stock_opname_id', $stockOpname->id)
                    ->firstOrFail();

                $selisih = $entry['qty_fisik'] - $opnameItem->qty_sistem;

                if ($selisih !== 0 && blank($entry['alasan'])) {
                    abort(422, "Alasan wajib diisi untuk barang dengan selisih (item: {$opnameItem->item_id})");
                }

                $opnameItem->update([
                    'qty_fisik' => $entry['qty_fisik'],
                    'selisih' => $selisih,
                    'alasan' => $entry['alasan'] ?? null,
                ]);

                if ($selisih === 0) {
                    continue;
                }

                InventoryService::createStockAdjustment([
                    'item_id' => $opnameItem->item_id,
                    'direction' => $selisih > 0 ? 'IN' : 'OUT',
                    'qty' => abs($selisih),
                    'unit_id' => $opnameItem->item?->satuan_dasar_id,
                    'tanggal' => $stockOpname->tanggal,
                    'keterangan' => "Adjustment Opname #{$stockOpname->id}: {$opnameItem->item?->nama_barang}",
                    'opname_item_id' => $opnameItem->id,
                ]);
            }

            $stockOpname->update(['status' => 'completed']);
        });

        return response()->json([
            'message' => 'Stock opname selesai, adjustment tercatat',
            'data' => $stockOpname->fresh(['items']),
        ]);
    }

    public function destroy(StockOpname $stockOpname)
    {
        $this->ensureAdmin();

        if ($stockOpname->status === 'completed') {
            abort(422, 'Opname yang sudah selesai tidak bisa dihapus');
        }

        $stockOpname->delete();

        return response()->json([
            'message' => 'Stock opname draft berhasil dihapus',
        ]);
    }
}
