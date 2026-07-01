<?php

namespace App\Exports;

use App\Models\StockIn;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class StockInsExport implements FromCollection, WithHeadings
{
    protected $startDate;
    protected $endDate;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function collection()
    {
        return StockIn::with('item')
            ->whereDate('tanggal', '>=', $this->startDate)
            ->whereDate('tanggal', '<=', $this->endDate)
            ->get()
            ->map(function ($item) {
                return [
                    'tanggal' => $item->tanggal,
                    'barang' => $item->item?->nama_barang,
                    'supplier' => $item->supplier,
                    'qty' => $item->qty,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Tanggal',
            'Barang',
            'Supplier',
            'Qty',
        ];
    }
}