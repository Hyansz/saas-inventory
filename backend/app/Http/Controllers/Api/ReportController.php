<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use Barryvdh\DomPDF\Facade\Pdf;

use Maatwebsite\Excel\Facades\Excel;

use App\Models\Item;
use App\Models\StockIn;
use App\Models\StockOut;
use App\Models\InventoryTransaction;

use App\Exports\TransactionsExport;
use App\Exports\StockInsExport;
use App\Exports\StockOutsExport;
use App\Exports\StockExport;

class ReportController extends Controller
{
    public function exportPdf(Request $request)
    {
        $request->validate([
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date'],
        ]);

        $type = $request->type;

        $startDate = $request->start_date;
        $endDate = $request->end_date;

        /*
        |--------------------------------------------------------------------------
        | TRANSACTIONS
        |--------------------------------------------------------------------------
        */

        if ($type === 'transactions') {

            $transactions = InventoryTransaction::with('item')
                ->whereDate('tanggal', '>=', $startDate)
                ->whereDate('tanggal', '<=', $endDate)
                ->latest()
                ->get();

            $pdf = Pdf::loadView(
                'reports.transactions',
                [
                    'transactions' => $transactions,
                    'startDate' => $startDate,
                    'endDate' => $endDate,
                ]
            );

            return $pdf->download(
                'laporan-transaksi.pdf'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | STOCK INS
        |--------------------------------------------------------------------------
        */

        if ($type === 'stock-ins') {

            $stockIns = StockIn::with('item')
                ->whereDate('tanggal', '>=', $startDate)
                ->whereDate('tanggal', '<=', $endDate)
                ->latest()
                ->get();

            $pdf = Pdf::loadView(
                'reports.stock-ins',
                [
                    'stockIns' => $stockIns,
                    'startDate' => $startDate,
                    'endDate' => $endDate,
                ]
            );

            return $pdf->download(
                'laporan-stock-in.pdf'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | STOCK OUTS
        |--------------------------------------------------------------------------
        */

        if ($type === 'stock-outs') {

            $stockOuts = StockOut::with('item')
                ->whereDate('tanggal', '>=', $startDate)
                ->whereDate('tanggal', '<=', $endDate)
                ->latest()
                ->get();

            $pdf = Pdf::loadView(
                'reports.stock-outs',
                [
                    'stockOuts' => $stockOuts,
                    'startDate' => $startDate,
                    'endDate' => $endDate,
                ]
            );

            return $pdf->download(
                'laporan-stock-out.pdf'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | STOCK
        |--------------------------------------------------------------------------
        */

        if ($type === 'stock') {

            $items = Item::with([
                'category',
            ])
                ->withSum('stockIns', 'qty')
                ->withSum('stockOuts', 'qty')
                ->get();

            $pdf = Pdf::loadView(
                'reports.stock',
                [
                    'items' => $items,
                ]
            );

            return $pdf->download(
                'laporan-stock.pdf'
            );
        }

        return response()->json([
            'message' => 'Jenis laporan tidak valid'
        ], 422);
    }

    public function exportExcel(Request $request)
    {
        $request->validate([
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date'],
        ]);

        $type = $request->type;

        /*
        |--------------------------------------------------------------------------
        | TRANSACTIONS
        |--------------------------------------------------------------------------
        */

        if ($type === 'transactions') {

            return Excel::download(
                new TransactionsExport(
                    $request->start_date,
                    $request->end_date
                ),
                'laporan-transaksi.xlsx'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | STOCK INS
        |--------------------------------------------------------------------------
        */

        if ($type === 'stock-ins') {

            return Excel::download(
                new StockInsExport(
                    $request->start_date,
                    $request->end_date
                ),
                'laporan-stock-in.xlsx'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | STOCK OUTS
        |--------------------------------------------------------------------------
        */

        if ($type === 'stock-outs') {

            return Excel::download(
                new StockOutsExport(
                    $request->start_date,
                    $request->end_date
                ),
                'laporan-stock-out.xlsx'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | STOCK
        |--------------------------------------------------------------------------
        */

        if ($type === 'stock') {

            return Excel::download(
                new StockExport(),
                'laporan-stock.xlsx'
            );
        }

        return response()->json([
            'message' => 'Jenis laporan tidak valid'
        ], 422);
    }
}