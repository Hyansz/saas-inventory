<?php

namespace App\Exports;

use App\Models\Item;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class StockExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Item::with('category')
            ->withSum('stockIns', 'qty')
            ->withSum('stockOuts', 'qty')
            ->get()
            ->map(function ($item) {

                $stock =
                    ($item->stock_ins_sum_qty ?? 0)
                    -
                    ($item->stock_outs_sum_qty ?? 0);

                return [
                    'barang' => $item->nama_barang,
                    'kategori' => $item->category?->name,
                    'stock' => $stock,
                    'minimal' => $item->stok_minimal,
                    'status' => $stock <= $item->stok_minimal
                        ? 'Menipis'
                        : 'Aman',
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Barang',
            'Kategori',
            'Stock',
            'Minimal',
            'Status',
        ];
    }
}