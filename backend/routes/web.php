<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'status' => 'Laravel Running'
    ]);
});

Route::get('/run-seed-once-bwO9LXTACp', function () {
    \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
    return 'Seeded!';
});