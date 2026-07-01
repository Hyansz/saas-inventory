<?php

namespace App\Exports;

use App\Models\StockOut;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class StockOutsExport implements FromCollection, WithHeadings
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
        return StockOut::with('item')
            ->whereDate('tanggal', '>=', $this->startDate)
            ->whereDate('tanggal', '<=', $this->endDate)
            ->get()
            ->map(function ($item) {
                return [
                    'tanggal' => $item->tanggal,
                    'barang' => $item->item?->nama_barang,
                    'tujuan' => $item->tujuan,
                    'qty' => $item->qty,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Tanggal',
            'Barang',
            'Tujuan',
            'Qty',
        ];
    }
}
