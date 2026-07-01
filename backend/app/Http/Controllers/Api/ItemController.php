<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\Request;

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

        $items = Item::with('category')
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
        ]);

        $item = Item::create($validated);

        return response()->json([
            'message' => 'Barang berhasil dibuat',
            'data' => $item,
        ], 201);
    }

    public function show(Item $item)
    {
        $item->load('category');

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
        ]);

        $item->update($validated);

        return response()->json([
            'message' => 'Barang berhasil diupdate',
            'data' => $item,
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
