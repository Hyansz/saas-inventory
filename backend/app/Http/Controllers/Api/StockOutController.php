<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StockOut;
use App\Services\InventoryService;
use Illuminate\Http\Request;

class StockOutController extends Controller
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
            StockOut::with(['item', 'user', 'unit'])
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
            'tujuan' => 'required|string',
            'tanggal' => 'required|date',
        ]);

        $validated['user_id'] = auth()->id();

        $stockOut = InventoryService::createStockOut($validated);

        return response()->json([
            'message' => 'Barang keluar berhasil ditambahkan',
            'data' => $stockOut->load(['item', 'user', 'unit']),
        ], 201);
    }

    public function show(StockOut $stockOut)
    {
        return response()->json(
            $stockOut->load(['item', 'user'])
        );
    }

    public function update(Request $request, StockOut $stockOut)
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'qty' => 'required_without:qty_unit|numeric|min:1',
            'qty_unit' => 'nullable|numeric|min:0.01',
            'unit_id' => 'nullable|integer|exists:item_units,id',
            'tujuan' => 'required|string',
            'tanggal' => 'required|date',
        ]);

        $stockOut = InventoryService::updateStockOut(
            $stockOut,
            $validated
        );

        return response()->json([
            'message' => 'Stock keluar berhasil diupdate',
            'data' => $stockOut->load(['item', 'user', 'unit']),
        ]);
    }

    public function destroy(StockOut $stockOut)
    {
        $this->ensureAdmin();

        InventoryService::deleteStockOut($stockOut);

        return response()->json([
            'message' => 'Data barang keluar berhasil dihapus',
        ]);
    }
}
