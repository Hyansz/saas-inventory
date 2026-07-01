<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Category;
use App\Models\Item;
use App\Models\StockIn;
use App\Models\StockOut;

use Illuminate\Support\Facades\DB;

use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        /*
        |--------------------------------------------------------------------------
        | SUMMARY
        |--------------------------------------------------------------------------
        */

        $totalItems = Item::count();

        $totalCategories = Category::count();

        $todayStockIn = StockIn::whereDate(
            'tanggal',
            Carbon::today()
        )->sum('qty');

        $todayStockOut = StockOut::whereDate(
            'tanggal',
            Carbon::today()
        )->sum('qty');

        /*
        |--------------------------------------------------------------------------
        | ITEMS + STOCK
        |--------------------------------------------------------------------------
        */

        $items = Item::withSum('stockIns', 'qty')
            ->withSum('stockOuts', 'qty')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | LOW STOCK
        |--------------------------------------------------------------------------
        */

        $lowStockItems = $items
            ->filter(function ($item) {
                return $item->isLowStock();
            })
            ->values()
            ->take(5);

        $lowStockCount = $lowStockItems->count();

        /*
        |--------------------------------------------------------------------------
        | INVENTORY HEALTH
        |--------------------------------------------------------------------------
        */

        $safeItems = $items
            ->filter(function ($item) {
                return $item->current_stock > $item->stok_minimal;
            })
            ->count();

        $inventoryHealth =
            $totalItems > 0
            ? round(($safeItems / $totalItems) * 100)
            : 0;

        /*
        |--------------------------------------------------------------------------
        | TOTAL MOVEMENTS
        |--------------------------------------------------------------------------
        */

        $totalMovements =
            StockIn::sum('qty')
            +
            StockOut::sum('qty');

        /*
        |--------------------------------------------------------------------------
        | RECENT ACTIVITIES
        |--------------------------------------------------------------------------
        */

        $recentStockIns = StockIn::with('item')
            ->latest()
            ->take(5)
            ->get();

        $recentStockOuts = StockOut::with('item')
            ->latest()
            ->take(5)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | LIVE ACTIVITIES
        |--------------------------------------------------------------------------
        */

        $stockInActivities = StockIn::with('item')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($item) {

                return [
                    'id' => 'in-' . $item->id,

                    'message' =>
                    'Stock masuk '
                        . $item->qty .
                        ' item "' .
                        ($item->item->nama_barang ?? '-') .
                        '"',

                    'time' => Carbon::parse(
                        $item->created_at
                    )->diffForHumans(),

                    'created_at' => $item->created_at,
                ];
            });

        $stockOutActivities = StockOut::with('item')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($item) {

                return [
                    'id' => 'out-' . $item->id,

                    'message' =>
                    'Stock keluar '
                        . $item->qty .
                        ' item "' .
                        ($item->item->nama_barang ?? '-') .
                        '"',

                    'time' => Carbon::parse(
                        $item->created_at
                    )->diffForHumans(),

                    'created_at' => $item->created_at,
                ];
            });

        $activities = $stockInActivities
            ->concat($stockOutActivities)
            ->sortByDesc('created_at')
            ->values()
            ->take(8);

        /*
        |--------------------------------------------------------------------------
        | CHART STOCK IN
        |--------------------------------------------------------------------------
        */

        $stockInChart = [];

        for ($i = 6; $i >= 0; $i--) {

            $date = Carbon::today()->subDays($i);

            $total = StockIn::whereDate(
                'tanggal',
                $date
            )->sum('qty');

            $stockInChart[] = [
                'date' => $date->format('d M'),
                'total' => $total,
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | CHART STOCK OUT
        |--------------------------------------------------------------------------
        */

        $stockOutChart = [];

        for ($i = 6; $i >= 0; $i--) {

            $date = Carbon::today()->subDays($i);

            $total = StockOut::whereDate(
                'tanggal',
                $date
            )->sum('qty');

            $stockOutChart[] = [
                'date' => $date->format('d M'),
                'total' => $total,
            ];
        }

        return response()->json([

            'summary' => [
                'total_items' => $totalItems,
                'total_categories' => $totalCategories,
                'today_stock_in' => $todayStockIn,
                'today_stock_out' => $todayStockOut,
                'low_stock_count' => $lowStockCount,
                'inventory_health' => $inventoryHealth,
                'total_movements' => $totalMovements,
            ],

            'low_stock_items' => $lowStockItems,

            'recent_stock_ins' => $recentStockIns,

            'recent_stock_outs' => $recentStockOuts,

            'activities' => $activities,

            'stock_in_chart' => $stockInChart,

            'stock_out_chart' => $stockOutChart,
        ]);
    }
}
