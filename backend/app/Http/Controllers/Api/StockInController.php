<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StockIn;
use App\Services\InventoryService;
use Illuminate\Http\Request;

class StockInController extends Controller
{
    private function ensureAdmin()
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Akses ditolak');
        }
    }

    public function index()
    {
        return response()->json(
            StockIn::with(['item', 'user', 'unit'])
                ->latest()
                ->paginate(10)
        );
    }

    public function store(Request $request)
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'qty' => 'required_without:qty_unit|numeric|min:1',
            'qty_unit' => 'nullable|numeric|min:0.01',
            'unit_id' => 'nullable|integer|exists:item_units,id',
            'supplier' => 'required|string',
            'tanggal' => 'required|date',
        ]);

        $validated['user_id'] = auth()->id();

        $stockIn = InventoryService::createStockIn($validated);

        return response()->json([
            'message' => 'Barang masuk berhasil ditambahkan',
            'data' => $stockIn->load(['item', 'user', 'unit']),
        ], 201);
    }

    public function show(StockIn $stockIn)
    {
        return response()->json(
            $stockIn->load(['item', 'user'])
        );
    }

    public function update(Request $request, StockIn $stockIn)
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'qty' => 'required_without:qty_unit|numeric|min:1',
            'qty_unit' => 'nullable|numeric|min:0.01',
            'unit_id' => 'nullable|integer|exists:item_units,id',
            'supplier' => 'required|string',
            'tanggal' => 'required|date',
        ]);

        $stockIn = InventoryService::updateStockIn(
            $stockIn,
            $validated
        );

        return response()->json([
            'message' => 'Stock masuk berhasil diupdate',
            'data' => $stockIn->load(['item', 'user', 'unit']),
        ]);
    }

    public function destroy(StockIn $stockIn)
    {
        $this->ensureAdmin();

        InventoryService::deleteStockIn($stockIn);

        return response()->json([
            'message' => 'Data barang masuk berhasil dihapus',
        ]);
    }
}
