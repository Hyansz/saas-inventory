<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\StockInController;
use App\Http\Controllers\Api\StockOutController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SearchController;

Route::post('/login', [AuthController::class, 'login']);

Route::get('/analytics', [AnalyticsController::class, 'index']);

Route::get('/tes', function () {
    return response()->json([
        'project' => base_path(),
    ]);
});

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/transactions', [TransactionController::class, 'index']);

    Route::get('/reports/pdf', [ReportController::class, 'exportPdf']);

    Route::get('/reports/excel', [ReportController::class, 'exportExcel']);

    Route::get(
        '/reports/transactions/pdf',
        [ReportController::class, 'transactionsPdf']
    );

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/me', [AuthController::class, 'me']);

    /*
    |--------------------------------------------------------------------------
    | ADMIN + MANAGER
    |--------------------------------------------------------------------------
    */

    Route::get('/items', [ItemController::class, 'index']);

    Route::get('/items/{item}', [ItemController::class, 'show']);

    /*
    |--------------------------------------------------------------------------
    | ADMIN ONLY
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin')->group(function () {

        Route::post('/items', [ItemController::class, 'store']);

        Route::put('/items/{item}', [ItemController::class, 'update']);

        Route::delete('/items/{item}', [ItemController::class, 'destroy']);

        Route::apiResource(
            'categories',
            CategoryController::class
        );

        Route::apiResource(
            'stock-ins',
            StockInController::class
        );

        Route::apiResource(
            'stock-outs',
            StockOutController::class
        );
    });

    Route::get('/search', [SearchController::class, 'index']);
});
