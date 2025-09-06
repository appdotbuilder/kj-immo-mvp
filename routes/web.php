<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminPropertyController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PropertyController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page with property search
Route::get('/', [HomeController::class, 'index'])->name('home');

// Public property routes
Route::get('/properties', [PropertyController::class, 'index'])->name('properties.index');
Route::get('/properties/{property}', [PropertyController::class, 'show'])->name('properties.show');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Property management for agents and admins
    Route::resource('properties', PropertyController::class)
        ->except(['index', 'show']);

    // Admin routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('dashboard');
        Route::resource('properties', AdminPropertyController::class)->only(['index', 'update']);
        Route::resource('users', AdminUserController::class)->only(['index', 'update', 'destroy']);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';