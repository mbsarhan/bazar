<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController; 
use App\Http\Controllers\CarAdsController;
use App\Http\Controllers\EmailChangeController;
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
Route::post('/email/verify-otp/resend', [VerificationController::class, 'resend'])
     ->name('verification.resend')
     ->middleware('throttle:1,2'); // Limit resends to 1 request every 2 minutes

     
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

  
  
    // Real-Estate Management
    Route::post('/realestate-ads', [RealestateAdsController::class, 'store']);
    Route::get('/user/realestate-ads', [RealestateAdsController::class, 'index']);


 
    
    Route::post('/user/email/request-change', [EmailChangeController::class, 'requestChange']);
    Route::post('/user/email/verify-change', [EmailChangeController::class, 'verifyChange'])->middleware('throttle:3,5');
});
