<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockOut extends Model
{
    protected $fillable = [
        'transaction_id',
        'item_id',
        'qty',
        'tujuan',
        'tanggal',
        'user_id',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
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
