<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VideoController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test/video/{advertisement}', [VideoController::class, 'show'])->name('video.test');

Route::post('/upload/video/{advertisement}', [VideoController::class, 'store'])->name('video.store');

Route::get('/upload/video/{advertisement}', [VideoController::class, 'create'])->name('video.create');



// in routes/web.php
    Route::get('/chat-test', function () {
        // Make sure you have at least two users in your 'users' table to test with.
        return view('chat-test');
    });