<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController; 
use App\Http\Controllers\CarAdsController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\RealestateAdsController;




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

Route::post('/email/verify-otp', [VerificationController::class, 'verifyOtp'])->name('verification.verify_otp');

// Protected routes (require Sanctum authentication)
Route::middleware('auth:sanctum')->group(function () {


    // Auth & User
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/user/verify-password', [UserController::class, 'verifyPassword']);
    Route::post('/user/password', [UserController::class, 'updatePassword']);

    
    // Car Ad Management
    Route::post('/car-ads', [CarAdsController::class, 'store']);
    Route::get('/user/car-ads', [CarAdsController::class, 'index']);
    Route::delete('/car-ads/{ad}', [CarAdsController::class, 'destroy']);
    Route::get('/car-ads/{ad}', [CarAdsController::class,'show']);

  
  
    // Route::resource('realestate-ads', RealestateAdsController::class)->only(['show']);  
    
    Route::resource('realestate-ads', RealestateAdsController::class);    
});

// Route::resource('realestate-ads', RealestateAdsController::class)->only('show');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/email/verify/resend', [VerificationController::class, 'resend'])
         ->name('verification.resend')
         ->middleware('throttle:6,1'); // Limit resends
});


// Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
//         ->name('verification.verify');
