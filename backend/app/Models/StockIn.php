<?php

namespace App\Models;

use App\Models\ItemUnit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockIn extends Model
{
    protected $fillable = [
        'transaction_id',
        'item_id',
        'qty',
        'unit_id',
        'qty_unit',
        'supplier',
        'tanggal',
        'user_id',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'qty_unit' => 'float',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(ItemUnit::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(InventoryTransaction::class);
    }
}
