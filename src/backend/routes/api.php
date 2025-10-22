<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController; 
use App\Http\Controllers\CarAdsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StreamingController;
use App\Http\Controllers\EmailChangeController;
use App\Http\Controllers\UserRatingsController;
use App\Http\Controllers\VideoUploadController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\PublicProfileController;
// use App\Http\Controllers\AdvertisementSearchController;
use App\Http\Controllers\RealestateAdsController;
use App\Http\Controllers\AdvertisementSearchController;
use App\Http\Controllers\AdvertisementController; // <-- 1. IMPORT




use App\Http\Controllers\Admin\PendingUpdateController; // <-- IMPORT THE CONTROLLER



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

// Advertisements & SearchFilters
Route::get('/advertisements', [AdvertisementController::class, 'index']);
Route::get('/advertisements/{ad}', [AdvertisementController::class, 'show']);

//Verify Email with Otp
Route::post('/email/verify-otp', [VerificationController::class, 'verifyOtp'])->name('verification.verify_otp');
Route::post('/email/verify-otp/resend', [VerificationController::class, 'resend'])
->name('verification.resend')
->middleware('throttle:1,2'); // Limit resends to 1 request every 2 minutes

// --- ADD THIS NEW PUBLIC ROUTE ---
Route::post('/advertisements/{ad}/view', [AdvertisementController::class, 'incrementView']);     


Route::get('/users/{userId}/public-profile', [PublicProfileController::class, 'show']);



//PASSWORD RESET ---
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword'])->name('password.email');
Route::post('/verify-password-reset-code', [PasswordResetController::class, 'verifyCode'])->name('password.verify.code');
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])->name('password.update');
Route::post('/resend-password-reset-code', [PasswordResetController::class, 'resendCode'])
    ->middleware('throttle:1,1') // 1 attempt per 1 minute
    ->name('password.resend.code');



// THIS IS THE CORRECT PLACE FOR THE STREAMING ROUTE
Route::get('/stream/{path}', [StreamingController::class, 'stream'])
    ->where('path', '.*')
    ->name('video.stream');


// Protected routes (require Sanctum authentication)
Route::middleware('auth:sanctum')->group(function () {


    // Auth & User
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/user/verify-password', [UserController::class, 'verifyPassword']);
    Route::post('/user/password', [UserController::class, 'updatePassword']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::get('/user/reviews', [UserController::class, 'getReviews']);

    
    // Car Ad Management
    Route::post('/car-ads', [CarAdsController::class, 'store']);
    Route::get('/user/car-ads', [CarAdsController::class, 'index']);
    Route::delete('/car-ads/{ad}', [CarAdsController::class, 'destroy']);
    Route::put('/car-ads/{ad}', [CarAdsController::class, 'update']);

  
  
    // Real-Estate Management
    Route::post('/realestate-ads', [RealestateAdsController::class, 'store']);
    Route::get('/user/realestate-ads', [RealestateAdsController::class, 'index']);
    Route::delete('/realestate-ads/{ad}', [RealestateAdsController::class, 'destroy']);
    Route::put('/realestate-ads/{ad}', [RealestateAdsController::class, 'update']);


    // DASHBOARD
    Route::get('/dashboard/statistics', [DashboardController::class, 'getStatistics']);
    Route::get('/dashboard/views', [DashboardController::class, 'getViews']);


    
    //Update Email
    Route::post('/user/email/request-change', [EmailChangeController::class, 'requestChange']);
    Route::post('/user/email/verify-change', [EmailChangeController::class, 'verifyChange'])
    ->middleware('throttle:3,5');
    
    Route::post('/user/email/resend-change', [EmailChangeController::class, 'resendChange'])
    ->middleware('throttle:1,2');



    //Rating and Review
    Route::post('/users/rate', [UserRatingsController::class, 'store'])->middleware('throttle:5,1');


    //Search and filter
    Route::get('/advertisement/search', [AdvertisementSearchController::class, 'search']);


    //Video
    Route::post('/advertisements/{advertisement}/video', [VideoUploadController::class, 'store'])
        ->name('api.video.store');



});
















// --- ADMIN ROUTES ---
// We can create a new middleware group for admins to keep things organized.
// The 'auth:sanctum' ensures they are logged in. We can add a custom 'is_admin' middleware later.
Route::middleware(['auth:sanctum'])->prefix('admin')->name('admin.')->group(function () {



    // --- ADD THIS ROUTE TO GET THE LIST ---
    Route::get('/pending-updates', [PendingUpdateController::class, 'index'])->name('pending-updates.index');
    
    // Route for an admin to approve a pending update
    Route::post('/pending-updates/{pendingUpdate}/approve', [PendingUpdateController::class, 'approve'])
        ->name('pending-updates.approve');

    // Route for an admin to reject a pending update
    Route::post('/pending-updates/{pendingUpdate}/reject', [PendingUpdateController::class, 'reject'])
        ->name('pending-updates.reject');
        
    // You can add a route to list all pending updates here later
    // Route::get('/pending-updates', [PendingUpdateController::class, 'index']);


    // --- ADD THIS ROUTE TO GET A SINGLE PENDING UPDATE ---
    Route::get('/pending-updates/{pendingUpdate}', [PendingUpdateController::class, 'show']);


    // --- ADD THIS ROUTE TO GET THE USERS LIST ---
    Route::get('/users', [UserController::class, 'index']);
});
