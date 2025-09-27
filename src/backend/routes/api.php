
<?php
// routes/api.php

use App\Http\Controllers\Api\AuthController;

Route::post('/login', [AuthController::class, 'login']);
// You'll also need a route to register users:
Route::post('/register', [AuthController::class, 'register']);