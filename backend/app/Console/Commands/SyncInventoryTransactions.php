<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\StockIn;
use App\Models\StockOut;
use App\Models\InventoryTransaction;

class SyncInventoryTransactions extends Command
{
    protected $signature = 'inventory:sync';

    protected $description = 'Sync stock in dan stock out ke inventory transactions';

    public function handle()
    {
        InventoryTransaction::truncate();

        foreach (StockIn::all() as $stockIn) {

            InventoryTransaction::create([
                'item_id' => $stockIn->item_id,
                'type' => 'IN',
                'qty' => $stockIn->qty,
                'tanggal' => $stockIn->tanggal,
            ]);
        }

        foreach (StockOut::all() as $stockOut) {

            InventoryTransaction::create([
                'item_id' => $stockOut->item_id,
                'type' => 'OUT',
                'qty' => $stockOut->qty,
                'tanggal' => $stockOut->tanggal,
            ]);
        }

        $this->info('Inventory transactions synced!');
    }
}
