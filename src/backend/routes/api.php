<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; // Add this line
use App\Http\Controllers\UserController;
use App\Http\Controllers\CarAdController; // <-- 1. IMPORT

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes (no authentication needed)
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Protected routes (require Sanctum authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/user', [AuthController::class, 'user'])->name('user');
        // --- 2. ADD THIS NEW ROUTE FOR UPDATING THE PASSWORD ---
    Route::post('/user/password', [UserController::class, 'updatePassword']);
    // --- ADD THE NEW ROUTE and keep the existing one for creating ---
    Route::get('/user/car-ads', [CarAdController::class, 'indexByUser']);
    // --- 2. ADD THIS NEW ROUTE ---
    Route::post('/car-ads', [CarAdController::class, 'store']);
    // --- ADD THIS NEW ROUTE FOR DELETING ---
    Route::delete('/car-ads/{advertisement}', [CarAdController::class, 'destroy']);
});