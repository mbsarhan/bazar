<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Services\AuthService;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request)
    {
        $response = $this->authService->register($request->validated());
        return response()->json($response, 201);
    }

    public function login(LoginRequest $request)
    {
        $response = $this->authService->login($request->validated());
        return response()->json($response);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'تمت عملية تسجيل الخروج بنجاح']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
