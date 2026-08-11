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
        'unit_id',
        'tanggal',
        'keterangan',
        'opname_item_id',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function unit()
    {
        return $this->belongsTo(ItemUnit::class);
    }

    public function opnameItem()
    {
        return $this->belongsTo(StockOpnameItem::class);
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
