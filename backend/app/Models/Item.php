<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Item extends Model
{
    protected $fillable = [
        'category_id',
        'kode_barang',
        'nama_barang',
        'stok_minimal',
        'satuan_dasar_id',
        'deskripsi',
    ];

    protected $appends = [
        'total_stock',
        'current_stock',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function units(): HasMany
    {
        return $this->hasMany(ItemUnit::class);
    }

    public function satuanDasar(): BelongsTo
    {
        return $this->belongsTo(ItemUnit::class, 'satuan_dasar_id');
    }

    public function stockIns(): HasMany
    {
        return $this->hasMany(StockIn::class);
    }

    public function stockOuts(): HasMany
    {
        return $this->hasMany(StockOut::class);
    }

    public function getTotalStockAttribute()
    {
        return ($this->stock_ins_sum_qty ?? 0)
            - ($this->stock_outs_sum_qty ?? 0);
    }

    public function transactions()
    {
        return $this->hasMany(InventoryTransaction::class);
    }

    public function getCurrentStockAttribute()
    {
        return ($this->stock_ins_sum_qty ?? 0)
            - ($this->stock_outs_sum_qty ?? 0);
    }

    public function isLowStock(): bool
    {
        return $this->current_stock > 0
            && $this->current_stock <= $this->stok_minimal;
    }

    public function isOutOfStock(): bool
    {
        return $this->current_stock <= 0;
    }
}
