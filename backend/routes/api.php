<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\TableController as AdminTableController;
use App\Http\Controllers\Customer\CategoryController;
use App\Http\Controllers\Customer\OrderController;
use App\Http\Controllers\Customer\ProductController;
use App\Http\Controllers\Customer\TableController;
use Illuminate\Support\Facades\Route;

Route::prefix('customer')->group(function () {
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{slug}', [ProductController::class, 'show']);
    Route::get('tables/{code}', [TableController::class, 'show']);
    Route::post('orders', [OrderController::class, 'store'])
        ->middleware('throttle:10,1');
    Route::get('orders/{orderNumber}', [OrderController::class, 'show']);
});

Route::prefix('admin')->group(function () {
    Route::post('login', [AuthController::class, 'login'])
        ->middleware('throttle:5,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);

        Route::middleware('role:admin')->group(function () {
            Route::get('dashboard', [DashboardController::class, 'index']);

            Route::get('categories', [AdminCategoryController::class, 'index']);
            Route::post('categories', [AdminCategoryController::class, 'store']);
            Route::put('categories/{category}', [AdminCategoryController::class, 'update']);
            Route::delete('categories/{category}', [AdminCategoryController::class, 'destroy']);

            Route::get('products', [AdminProductController::class, 'index']);
            Route::post('products', [AdminProductController::class, 'store']);
            Route::post('products/{product}', [AdminProductController::class, 'update']);
            Route::delete('products/{product}', [AdminProductController::class, 'destroy']);

            Route::get('tables', [AdminTableController::class, 'index']);
            Route::post('tables', [AdminTableController::class, 'store']);
            Route::put('tables/{table}', [AdminTableController::class, 'update']);
            Route::delete('tables/{table}', [AdminTableController::class, 'destroy']);
            Route::get('tables/{table}/qrcode', [AdminTableController::class, 'qrCode']);
        });

        Route::middleware('role:admin,cashier,kitchen')->group(function () {
            Route::get('orders', [AdminOrderController::class, 'index']);
            Route::get('orders/{order}', [AdminOrderController::class, 'show']);
            Route::patch('orders/{order}/status', [AdminOrderController::class, 'updateStatus']);
        });
    });
});