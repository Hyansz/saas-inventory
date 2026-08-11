<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockOpnameItem extends Model
{
    protected $fillable = [
        'stock_opname_id',
        'item_id',
        'qty_sistem',
        'qty_fisik',
        'selisih',
        'unit_id',
        'alasan',
    ];

    protected $casts = [
        'qty_sistem' => 'integer',
        'qty_fisik' => 'integer',
        'selisih' => 'integer',
    ];

    public function opname(): BelongsTo
    {
        return $this->belongsTo(StockOpname::class, 'stock_opname_id');
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(ItemUnit::class);
    }
}
