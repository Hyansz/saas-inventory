<?php

namespace App\Services;

use App\Models\InventoryTransaction;
use App\Models\Item;
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
    | CREATE STOCK IN
    |--------------------------------------------------------------------------
    */

    public static function createStockIn(array $data): StockIn
    {
        return DB::transaction(function () use ($data) {

            $transaction = InventoryTransaction::create([
                'item_id' => $data['item_id'],
                'type' => 'IN',
                'qty' => $data['qty'],
                'tanggal' => $data['tanggal'],
                'keterangan' => 'Stock Masuk',
            ]);

            $data['transaction_id'] = $transaction->id;

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

        return DB::transaction(function () use ($stockIn, $data) {

            $stockIn->transaction->update([
                'item_id' => $data['item_id'],
                'qty' => $data['qty'],
                'tanggal' => $data['tanggal'],
                'type' => 'IN',
                'keterangan' => 'Stock Masuk',
            ]);

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

        if (self::currentStock($item) < $data['qty']) {
            abort(422, 'Stok tidak mencukupi');
        }

        return DB::transaction(function () use ($data) {

            $transaction = InventoryTransaction::create([
                'item_id' => $data['item_id'],
                'type' => 'OUT',
                'qty' => $data['qty'],
                'tanggal' => $data['tanggal'],
                'keterangan' => 'Stock Keluar',
            ]);

            $data['transaction_id'] = $transaction->id;

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

        $available = self::currentStock($item) + $stockOut->qty;

        if ($available < $data['qty']) {
            abort(422, 'Stok tidak mencukupi');
        }

        return DB::transaction(function () use ($stockOut, $data) {

            $stockOut->transaction->update([
                'item_id' => $data['item_id'],
                'qty' => $data['qty'],
                'tanggal' => $data['tanggal'],
                'type' => 'OUT',
                'keterangan' => 'Stock Keluar',
            ]);

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
}
