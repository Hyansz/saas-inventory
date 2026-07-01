<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\InventoryTransaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function index()
    {
        // =========================
        // RANGE 7 HARI
        // =========================
        $days = collect(range(0, 6))->map(function ($i) {
            return Carbon::now()->subDays(6 - $i)->format('Y-m-d');
        });

        // =========================
        // STOCK IN
        // =========================
        $stockIn = InventoryTransaction::select(
            DB::raw('DATE(tanggal) as date'),
            DB::raw('SUM(qty) as total')
        )
            ->where('type', 'IN') // FIX (HARUS CAPITAL)
            ->where('tanggal', '>=', now()->subDays(6))
            ->groupBy(DB::raw('DATE(tanggal)'))
            ->pluck('total', 'date');

        // =========================
        // STOCK OUT
        // =========================
        $stockOut = InventoryTransaction::select(
            DB::raw('DATE(tanggal) as date'),
            DB::raw('SUM(qty) as total')
        )
            ->where('type', 'OUT') // FIX
            ->where('tanggal', '>=', now()->subDays(6))
            ->groupBy(DB::raw('DATE(tanggal)'))
            ->pluck('total', 'date');

        // =========================
        // FORMAT CHART
        // =========================
        $stockInChart = $days->map(function ($date) use ($stockIn) {
            return [
                'date' => Carbon::parse($date)->format('d M'),
                'total' => (int) ($stockIn[$date] ?? 0),
            ];
        });

        $stockOutChart = $days->map(function ($date) use ($stockOut) {
            return [
                'date' => Carbon::parse($date)->format('d M'),
                'total' => (int) ($stockOut[$date] ?? 0),
            ];
        });

        // =========================
        // ACTIVITIES (REAL DATA)
        // =========================
        $activities = InventoryTransaction::with('item')
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($t) {
                return [
                    'id' => $t->id,
                    'type' => $t->type,
                    'message' => $t->type === 'IN'
                        ? "Stock masuk: {$t->item->nama_barang} (+{$t->qty})"
                        : "Stock keluar: {$t->item->nama_barang} (-{$t->qty})",
                    'time' => Carbon::parse($t->tanggal)->diffForHumans(),
                ];
            });

        // =========================
        // ALERT ENGINE
        // =========================
        $alerts = [];

        // 1. Lonjakan stock keluar hari ini
        $todayOut = InventoryTransaction::where('type', 'OUT')
            ->whereDate('tanggal', today())
            ->sum('qty');

        if ($todayOut > 50) { // bisa kamu adjust
            $alerts[] = [
                'type' => 'warning',
                'message' => 'Lonjakan barang keluar hari ini',
            ];
        }

        // 2. Out of stock
        $outOfStock = Item::withSum('stockIns', 'qty')
            ->withSum('stockOuts', 'qty')
            ->get()
            ->filter(fn($item) => $item->isOutOfStock())
            ->count();

        if ($outOfStock > 0) {
            $alerts[] = [
                'type' => 'danger',
                'message' => "{$outOfStock} barang kehabisan stok",
            ];
        }

        // 3. Stock menipis
        $lowStock = Item::withSum('stockIns', 'qty')
            ->withSum('stockOuts', 'qty')
            ->get()
            ->filter(fn($item) => $item->isLowStock() && !$item->isOutOfStock())
            ->count();

        if ($lowStock > 0) {
            $alerts[] = [
                'type' => 'warning',
                'message' => "{$lowStock} barang berada di bawah stok minimal",
            ];
        }

        // 4. Dead stock (tidak ada transaksi 7 hari)
        $inactiveItems = Item::whereDoesntHave('transactions', function ($q) {
            $q->where('tanggal', '>=', now()->subDays(7)); // FIX
        })->count();

        if ($inactiveItems > 0) {
            $alerts[] = [
                'type' => 'info',
                'message' => "{$inactiveItems} barang tidak bergerak 7 hari",
            ];
        }

        return response()->json([
            'stock_in_chart' => $stockInChart,
            'stock_out_chart' => $stockOutChart,
            'activities' => $activities,
            'alerts' => $alerts,
        ]);
    }
}
