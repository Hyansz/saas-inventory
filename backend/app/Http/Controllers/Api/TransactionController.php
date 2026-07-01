<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryTransaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;
        $type = $request->type;
        $startDate = $request->start_date;
        $endDate = $request->end_date;

        $transactions = InventoryTransaction::with('item')

            ->when($search, function ($query) use ($search) {
                $query->whereHas('item', function ($q) use ($search) {
                    $q->where('nama_barang', 'ilike', "%{$search}%")
                        ->orWhere('kode_barang', 'ilike', "%{$search}%");
                });
            })

            ->when($type, function ($query) use ($type) {
                $query->where('type', $type);
            })

            ->when($startDate, function ($query) use ($startDate) {
                $query->whereDate('tanggal', '>=', $startDate);
            })

            ->when($endDate, function ($query) use ($endDate) {
                $query->whereDate('tanggal', '<=', $endDate);
            })

            ->latest()
            ->paginate(15);

        return response()->json($transactions);
    }
}
