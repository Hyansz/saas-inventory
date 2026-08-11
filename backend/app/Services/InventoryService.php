<?php

namespace App\Services;

use App\Models\InventoryTransaction;
use App\Models\Item;
use App\Models\ItemUnit;
use App\Models\StockIn;
use App\Models\StockOut;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    /*
    |--------------------------------------------------------------------------
    | CURRENT STOCK
    |--------------------------------------------------------------------------
    */

    public static function currentStock(Item $item): int
    {
        return InventoryTransaction::where('item_id', $item->id)
            ->selectRaw("
                COALESCE(
                    SUM(
                        CASE
                            WHEN type='IN' THEN qty
                            WHEN type='OUT' THEN -qty
                        END
                    ),0
                ) as stock
            ")
            ->value('stock');
    }

    /*
    |--------------------------------------------------------------------------
    | UNIT RESOLUTION & CONVERSION
    |--------------------------------------------------------------------------
    */

    public static function resolveUnit(Item $item, ?int $unitId = null): ItemUnit
    {
        if ($unitId) {
            $unit = ItemUnit::find($unitId);

            if (!$unit || $unit->item_id !== $item->id) {
                abort(422, 'Satuan tidak terdaftar untuk barang ini');
            }

            return $unit;
        }

        $unit = $item->satuanDasar
            ?? $item->units()->where('is_base', true)->first();

        if (!$unit) {
            abort(422, 'Barang belum memiliki satuan dasar');
        }

        return $unit;
    }

    public static function convertToBase(ItemUnit $unit, float $qtyUnit): int
    {
        if ($qtyUnit <= 0) {
            abort(422, 'Jumlah harus lebih dari 0');
        }

        $qtyBase = $qtyUnit * $unit->konversi;

        if (abs($qtyBase - round($qtyBase)) > 1e-6 || round($qtyBase) < 1) {
            abort(422, "Konversi menghasilkan pecahan: {$qtyUnit} {$unit->nama_unit} = {$qtyBase} satuan dasar");
        }

        return (int) round($qtyBase);
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE STOCK IN
    |--------------------------------------------------------------------------
    */

    public static function createStockIn(array $data): StockIn
    {
        $item = Item::findOrFail($data['item_id']);

        $unit = self::resolveUnit($item, $data['unit_id'] ?? null);

        $qtyBase = self::convertToBase($unit, (float) ($data['qty_unit'] ?? $data['qty']));

        return DB::transaction(function () use ($data, $item, $unit, $qtyBase) {

            $transaction = InventoryTransaction::create([
                'item_id' => $item->id,
                'type' => 'IN',
                'qty' => $qtyBase,
                'unit_id' => $unit->id,
                'tanggal' => $data['tanggal'],
                'keterangan' => 'Stock Masuk',
            ]);

            $data['transaction_id'] = $transaction->id;
            $data['qty'] = $qtyBase;
            $data['unit_id'] = $unit->id;
            $data['qty_unit'] = $data['qty_unit'] ?? $qtyBase;

            return StockIn::create($data);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE STOCK IN
    |--------------------------------------------------------------------------
    */

    public static function updateStockIn(
        StockIn $stockIn,
        array $data
    ): StockIn {

        $item = Item::findOrFail($data['item_id']);

        $unit = self::resolveUnit($item, $data['unit_id'] ?? null);

        $qtyBase = self::convertToBase($unit, (float) ($data['qty_unit'] ?? $data['qty']));

        return DB::transaction(function () use ($stockIn, $data, $unit, $qtyBase) {

            $stockIn->transaction->update([
                'item_id' => $data['item_id'],
                'qty' => $qtyBase,
                'unit_id' => $unit->id,
                'tanggal' => $data['tanggal'],
                'type' => 'IN',
                'keterangan' => 'Stock Masuk',
            ]);

            $data['qty'] = $qtyBase;
            $data['unit_id'] = $unit->id;
            $data['qty_unit'] = $data['qty_unit'] ?? $qtyBase;

            $stockIn->update($data);

            return $stockIn->fresh();
        });
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE STOCK IN
    |--------------------------------------------------------------------------
    */

    public static function deleteStockIn(StockIn $stockIn): void
    {
        DB::transaction(function () use ($stockIn) {

            $stockIn->transaction()?->delete();

            $stockIn->delete();
        });
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE STOCK OUT
    |--------------------------------------------------------------------------
    */

    public static function createStockOut(array $data): StockOut
    {
        $item = Item::findOrFail($data['item_id']);

        $unit = self::resolveUnit($item, $data['unit_id'] ?? null);

        $qtyBase = self::convertToBase($unit, (float) ($data['qty_unit'] ?? $data['qty']));

        if (self::currentStock($item) < $qtyBase) {
            abort(422, 'Stok tidak mencukupi');
        }

        return DB::transaction(function () use ($data, $item, $unit, $qtyBase) {

            $transaction = InventoryTransaction::create([
                'item_id' => $item->id,
                'type' => 'OUT',
                'qty' => $qtyBase,
                'unit_id' => $unit->id,
                'tanggal' => $data['tanggal'],
                'keterangan' => 'Stock Keluar',
            ]);

            $data['transaction_id'] = $transaction->id;
            $data['qty'] = $qtyBase;
            $data['unit_id'] = $unit->id;
            $data['qty_unit'] = $data['qty_unit'] ?? $qtyBase;

            return StockOut::create($data);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE STOCK OUT
    |--------------------------------------------------------------------------
    */

    public static function updateStockOut(
        StockOut $stockOut,
        array $data
    ): StockOut {

        $item = Item::findOrFail($data['item_id']);

        $unit = self::resolveUnit($item, $data['unit_id'] ?? null);

        $qtyBase = self::convertToBase($unit, (float) ($data['qty_unit'] ?? $data['qty']));

        $available = self::currentStock($item) + $stockOut->qty;

        if ($available < $qtyBase) {
            abort(422, 'Stok tidak mencukupi');
        }

        return DB::transaction(function () use ($stockOut, $data, $unit, $qtyBase) {

            $stockOut->transaction->update([
                'item_id' => $data['item_id'],
                'qty' => $qtyBase,
                'unit_id' => $unit->id,
                'tanggal' => $data['tanggal'],
                'type' => 'OUT',
                'keterangan' => 'Stock Keluar',
            ]);

            $data['qty'] = $qtyBase;
            $data['unit_id'] = $unit->id;
            $data['qty_unit'] = $data['qty_unit'] ?? $qtyBase;

            $stockOut->update($data);

            return $stockOut->fresh();
        });
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE STOCK OUT
    |--------------------------------------------------------------------------
    */

    public static function deleteStockOut(StockOut $stockOut): void
    {
        DB::transaction(function () use ($stockOut) {

            $stockOut->transaction()?->delete();

            $stockOut->delete();
        });
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE STOCK ADJUSTMENT (STOCK OPNAME)
    |--------------------------------------------------------------------------
    */

    public static function createStockAdjustment(array $data): InventoryTransaction
    {
        return InventoryTransaction::create([
            'item_id' => $data['item_id'],
            'type' => $data['direction'],
            'qty' => $data['qty'],
            'unit_id' => $data['unit_id'] ?? null,
            'tanggal' => $data['tanggal'],
            'keterangan' => $data['keterangan'],
            'opname_item_id' => $data['opname_item_id'],
        ]);
    }
}
