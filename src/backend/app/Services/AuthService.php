<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Exception;

class AuthService
{
    /**
     * Handle user registration
     */
    public function register(array $data): array
    {
        try {
            $user = User::create([
                'fname'       => $data['fname'],
                'lname'       => $data['lname'],
                'email'       => $data['email'] ?? null,
                'phone'       => $data['phone'] ?? null,
                'password'    => Hash::make($data['password']),
                'admin'       => false,
                'review'      => 0,
                'total_view'  => 0,
            ]);

            $token = $user->createToken('authToken')->plainTextToken;

            return [
                'message' => 'تمت عملية تسجيل المستخدم بنجاح',
                // 'user' => $user,
                // 'access_token' => $token,
                // 'token_type' => 'Bearer',
            ];
        } catch (Exception $e) {
            // Log the error for debugging
            Log::error('Register failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data'  => $data,
            ]);

            return [
                'message' => 'حدث خطأ أثناء تسجيل المستخدم الرجاء إعادة المحاولة',
                'error'   => $e->getMessage(),
            ];
        }
    }

    /**
     * Handle user login
     */
    public function login(array $data): array
    {
        try {
            $user = User::where('email', $data['email'])->first();

            if (! $user || ! Hash::check($data['password'], $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['The provided credentials do not match our records.'],
                ]);
            }

            $token = $user->createToken('authToken')->plainTextToken;

            return [
                'message' => 'تمت عملية تسجيل الدخول بنجاح',
                // 'user' => $user,
                'access_token' => $token,
                // 'token_type' => 'Bearer',
            ];
        } catch (ValidationException $e) {
            // Log invalid login attempts separately
            Log::warning('Login validation failed', [
                'error' => $e->getMessage(),
                'data'  => $data,
            ]);

            throw $e; // rethrow so controller handles validation errors correctly
        } catch (Exception $e) {
            // Log unexpected errors
            Log::error('Login failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data'  => $data,
            ]);

            return [
                'message' => 'فشل تسجيل الدخول الرجاء إعادة المحاولة',
                'error'   => $e->getMessage(),
            ];
        }
    }
}
