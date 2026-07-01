<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Item;
use App\Models\StockIn;
use App\Models\StockOut;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $q = trim($request->q);

        if (!$q) {
            return response()->json([
                'menus' => [],
                'items' => [],
                'categories' => [],
                'transactions' => [],
                'stockMonitorings' => [],
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | MENUS
        |--------------------------------------------------------------------------
        */

        $menuList = [
            [
                'title' => 'Dashboard',
                'href' => '/dashboard',
            ],
            [
                'title' => 'Data Barang',
                'href' => '/items',
            ],
            [
                'title' => 'Barang Masuk',
                'href' => '/stock-ins',
            ],
            [
                'title' => 'Barang Keluar',
                'href' => '/stock-outs',
            ],
            [
                'title' => 'Riwayat Transaksi',
                'href' => '/transactions',
            ],
            [
                'title' => 'Stock Monitoring',
                'href' => '/stock-monitoring',
            ],
            [
                'title' => 'Kategori',
                'href' => '/categories',
            ],
            [
                'title' => 'Laporan',
                'href' => '/reports',
            ],
        ];

        $menus = collect($menuList)
            ->filter(function ($menu) use ($q) {
                return str_contains(
                    strtolower($menu['title']),
                    strtolower($q)
                );
            })
            ->values()
            ->map(function ($menu) {
                return [
                    'title' => $menu['title'],
                    'subtitle' => 'Menu Navigation',
                    'href' => $menu['href'],
                    'page' => $menu['title'],
                    'type' => 'menu',
                ];
            });

        /*
        |--------------------------------------------------------------------------
        | ITEMS
        |--------------------------------------------------------------------------
        */

        $items = Item::query()
            ->where(function ($query) use ($q) {
                $query
                    ->where('nama_barang', 'like', "%{$q}%")
                    ->orWhere('kode_barang', 'like', "%{$q}%");
            })
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->nama_barang,
                    'subtitle' => 'Kode: ' . $item->kode_barang,
                    'href' => '/items',
                    'page' => 'Data Barang',
                    'type' => 'item',
                ];
            });

        /*
        |--------------------------------------------------------------------------
        | STOCK IN
        |--------------------------------------------------------------------------
        */

        $stockIns = StockIn::with('item')
            ->whereHas('item', function ($query) use ($q) {
                $query
                    ->where('nama_barang', 'like', "%{$q}%")
                    ->orWhere('kode_barang', 'like', "%{$q}%");
            })
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($trx) {

                if (!$trx->item) {
                    return null;
                }

                return [
                    'id' => $trx->id,
                    'title' => $trx->item->nama_barang,
                    'subtitle' => 'Barang Masuk +' . $trx->qty,
                    'href' => '/stock-ins',
                    'page' => 'Barang Masuk',
                    'type' => 'stock_in',
                ];
            })
            ->filter();

        /*
        |--------------------------------------------------------------------------
        | STOCK OUT
        |--------------------------------------------------------------------------
        */

        $stockOuts = StockOut::with('item')
            ->whereHas('item', function ($query) use ($q) {
                $query
                    ->where('nama_barang', 'like', "%{$q}%")
                    ->orWhere('kode_barang', 'like', "%{$q}%");
            })
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($trx) {

                if (!$trx->item) {
                    return null;
                }

                return [
                    'id' => $trx->id,
                    'title' => $trx->item->nama_barang,
                    'subtitle' => 'Barang Keluar -' . $trx->qty,
                    'href' => '/stock-outs',
                    'page' => 'Barang Keluar',
                    'type' => 'stock_out',
                ];
            })
            ->filter();

        /*
        |--------------------------------------------------------------------------
        | TRANSACTIONS
        |--------------------------------------------------------------------------
        */

        $transactions = collect()
            ->concat($stockIns)
            ->concat($stockOuts)
            ->values();

        /*
        |--------------------------------------------------------------------------
        | STOCK Monitoring
        |--------------------------------------------------------------------------
        */

        $stockMonitorings = Item::query()
            ->where(function ($query) use ($q) {
                $query
                    ->where('nama_barang', 'like', "%{$q}%")
                    ->orWhere('kode_barang', 'like', "%{$q}%");
            })
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->nama_barang,
                    'subtitle' => 'Monitoring Stock',
                    'href' => '/stock-monitoring',
                    'page' => 'Stock Monitoring',
                    'type' => 'stock_monitoring',
                ];
            });

        /*
        |--------------------------------------------------------------------------
        | CATEGORIES
        |--------------------------------------------------------------------------
        */

        $categories = Category::query()
            ->where('nama', 'like', "%{$q}%")
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'title' => $category->nama,
                    'subtitle' => 'Kategori Barang',
                    'href' => '/categories',
                    'page' => 'Kategori',
                    'type' => 'category',
                ];
            });

        return response()->json([
            'menus' => $menus->values(),
            'items' => $items->values(),
            'categories' => $categories->values(),
            'transactions' => $transactions->values(),
            'stockMonitorings' => $stockMonitorings->values(),
        ]);
    }
}