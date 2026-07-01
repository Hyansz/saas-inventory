<?php

namespace App\Exports;

use App\Models\InventoryTransaction;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class TransactionsExport implements FromCollection, WithHeadings
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
        return InventoryTransaction::with('item')
            ->whereDate('tanggal', '>=', $this->startDate)
            ->whereDate('tanggal', '<=', $this->endDate)
            ->latest()
            ->get()
            ->map(function ($trx) {

                return [

                    'tanggal' => $trx->tanggal,

                    'barang' => $trx->item?->nama_barang,

                    'type' => $trx->type,

                    'qty' => $trx->qty,

                ];
            });
    }

    public function headings(): array
    {
        return [
            'Tanggal',
            'Barang',
            'Type',
            'Qty',
        ];
    }
}