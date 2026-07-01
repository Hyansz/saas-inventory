<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class InventoryTransaction extends Model
{
    protected $fillable = [
        'item_id',
        'type',
        'qty',
        'tanggal',
        'keterangan',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function stockIn(): HasOne
    {
        return $this->hasOne(StockIn::class, 'transaction_id');
    }

    public function stockOut(): HasOne
    {
        return $this->hasOne(StockOut::class, 'transaction_id');
    }
}
