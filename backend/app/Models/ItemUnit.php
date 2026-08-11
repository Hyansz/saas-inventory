<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemUnit extends Model
{
    protected $fillable = [
        'item_id',
        'nama_unit',
        'konversi',
        'is_base',
    ];

    protected $casts = [
        'konversi' => 'float',
        'is_base' => 'boolean',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
