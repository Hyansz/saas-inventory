<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\ItemUnit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ItemController extends Controller
{
    private function ensureAdmin()
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Akses ditolak');
        }
    }

    public function index(Request $request)
    {
        $search = $request->search;

        $limit = $request->integer('limit', 10);

        $items = Item::with(['category', 'units', 'satuanDasar'])
            ->withSum('stockIns', 'qty')
            ->withSum('stockOuts', 'qty')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_barang', 'like', "%{$search}%")
                        ->orWhere('kode_barang', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($limit);

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'kode_barang' => ['required', 'unique:items,kode_barang'],
            'nama_barang' => ['required'],
            'stok_minimal' => ['nullable', 'integer'],
            'deskripsi' => ['nullable'],
            'units' => ['required', 'array', 'min:1'],
            'units.*.nama_unit' => ['required', 'in:pcs,pack/box,karton'],
            'units.*.konversi' => ['required', 'numeric', 'gt:0'],
            'units.*.is_base' => ['required', 'boolean'],
        ]);

        $baseUnits = collect($validated['units'])->where('is_base', true);

        if ($baseUnits->count() !== 1) {
            return response()->json([
                'message' => 'Pilih tepat satu satuan dasar',
            ], 422);
        }

        if (abs((float) $baseUnits->first()['konversi'] - 1) > 1e-6) {
            return response()->json([
                'message' => 'Konversi satuan dasar harus 1',
            ], 422);
        }

        if (collect($validated['units'])->pluck('nama_unit')->duplicates()->isNotEmpty()) {
            return response()->json([
                'message' => 'Nama satuan tidak boleh duplikat',
            ], 422);
        }

        $item = DB::transaction(function () use ($validated) {

            $item = Item::create(
                collect($validated)->except('units')->all()
            );

            foreach ($validated['units'] as $unit) {
                ItemUnit::create([
                    'item_id' => $item->id,
                    'nama_unit' => $unit['nama_unit'],
                    'konversi' => $unit['konversi'],
                    'is_base' => (bool) $unit['is_base'],
                ]);
            }

            $baseUnit = $item->units()->where('is_base', true)->first();

            $item->update(['satuan_dasar_id' => $baseUnit->id]);

            return $item;
        });

        return response()->json([
            'message' => 'Barang berhasil dibuat',
            'data' => $item->load(['units', 'satuanDasar']),
        ], 201);
    }

    public function show(Item $item)
    {
        $item->load(['category', 'units', 'satuanDasar']);

        return response()->json($item);
    }

    public function update(Request $request, Item $item)
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'kode_barang' => ['required', 'unique:items,kode_barang,' . $item->id],
            'nama_barang' => ['required'],
            'stok_minimal' => ['nullable', 'integer'],
            'deskripsi' => ['nullable'],
            'units' => ['required', 'array', 'min:1'],
            'units.*.nama_unit' => ['required', 'in:pcs,pack/box,karton'],
            'units.*.konversi' => ['required', 'numeric', 'gt:0'],
            'units.*.is_base' => ['required', 'boolean'],
        ]);

        $baseUnits = collect($validated['units'])->where('is_base', true);

        if ($baseUnits->count() !== 1) {
            return response()->json([
                'message' => 'Pilih tepat satu satuan dasar',
            ], 422);
        }

        if (abs((float) $baseUnits->first()['konversi'] - 1) > 1e-6) {
            return response()->json([
                'message' => 'Konversi satuan dasar harus 1',
            ], 422);
        }

        if (collect($validated['units'])->pluck('nama_unit')->duplicates()->isNotEmpty()) {
            return response()->json([
                'message' => 'Nama satuan tidak boleh duplikat',
            ], 422);
        }

        $item = DB::transaction(function () use ($item, $validated) {

            $item->update(
                collect($validated)->except('units')->all()
            );

            $item->units()->delete();

            foreach ($validated['units'] as $unit) {
                ItemUnit::create([
                    'item_id' => $item->id,
                    'nama_unit' => $unit['nama_unit'],
                    'konversi' => $unit['konversi'],
                    'is_base' => (bool) $unit['is_base'],
                ]);
            }

            $baseUnit = $item->units()->where('is_base', true)->first();

            $item->update(['satuan_dasar_id' => $baseUnit->id]);

            return $item;
        });

        return response()->json([
            'message' => 'Barang berhasil diupdate',
            'data' => $item->load(['units', 'satuanDasar']),
        ]);
    }

    public function destroy(Item $item)
    {
        $this->ensureAdmin();

        $item->delete();

        return response()->json([
            'message' => 'Barang berhasil dihapus',
        ]);
    }
}
