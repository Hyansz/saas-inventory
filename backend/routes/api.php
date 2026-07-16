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
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SessionController;

Route::post('/login', [AuthController::class, 'login']);

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

    Route::get('/analytics', [AnalyticsController::class, 'index']);

    /*
    |--------------------------------------------------------------------------
    | ADMIN + SUPER ADMIN
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin,super_admin')->group(function () {

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

    /*
    |--------------------------------------------------------------------------
    | SUPER ADMIN ONLY
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:super_admin')->prefix('admin')->group(function () {

        Route::apiResource('users', UserController::class)->except(['show']);

        Route::get('/active-sessions', [SessionController::class, 'index']);

        Route::post('/force-logout/{user}', [SessionController::class, 'forceLogout']);

        Route::delete('/force-logout-token/{tokenId}', [SessionController::class, 'forceLogoutToken']);
    });
});
