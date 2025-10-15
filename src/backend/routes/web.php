<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VideoController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test/video/{advertisement}', [VideoController::class, 'show'])->name('video.test');

Route::post('/upload/video/{advertisement}', [VideoController::class, 'store'])->name('video.store');

Route::get('/upload/video/{advertisement}', [VideoController::class, 'create'])->name('video.create');