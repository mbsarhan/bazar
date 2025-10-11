<?php

namespace App\Services;

use Exception;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;


class AuthService
{

    public function register(array $data): array
    {
        try {
            $user = User::create([
                'fname'                        => $data['fname'],
                'lname'                        => $data['lname'],
                'email'                        => $data['email'] ?? null,
                'phone'                        => $data['phone'] ?? null,
                'password'                     => Hash::make($data['password']),
                'admin'                        => false,
                'review'                       => 0,
                'total_view'                   => 0,
            ]);
            
        $message = 'تمت عملية تسجيل المستخدم بنجاح.'; // Default success message

        if ($user->email) {
                $user->sendEmailVerificationNotification();
                $message = 'تمت عملية تسجيل المستخدم بنجاح. يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك';
            }

            return [
                'message' => $message,
            ];
        } catch (Exception $e) {
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


       public function login(array $data): array
    {
        try {
            $credential = $data['credential'];
            $password = $data['password'];

            $user = null;

            // Determine if the credential is an email or a phone number
            if (filter_var($credential, FILTER_VALIDATE_EMAIL)) {
                // It's an email, find the user by email.
                $user = User::where('email', $credential)->first();
            } else {
                // It's not an email, assume it's a phone number.
                $user = User::where('phone', $credential)->first();
            }

            if (! $user || ! Hash::check($password, $user->password)) {
                throw ValidationException::withMessages([
                    // Use 'credential' as the key to match the form field
                    'credential' => ['بيانات الاعتماد المقدمة غير صحيحة.'],
                ]);
            }
            
            // Check this user has verify his email
            if (! $user->hasVerifiedEmail()) {
                throw ValidationException::withMessages([
                    'credential' => ['الرجاء التحقق من بريدك الإلكتروني قبل تسجيل الدخول.'],
                ]);
            }

            $token = $user->createToken('authToken')->plainTextToken;

            return [
                'message' => 'تمت عملية تسجيل الدخول بنجاح',
                'access_token' => $token,
                'user' => $user, 
            ];
        } catch (ValidationException $e) {
            throw $e;
        } catch (Exception $e) {
            Log::error('Login failed', ['error' => $e->getMessage()]);
            return ['message' => 'فشل تسجيل الدخول الرجاء إعادة المحاولة'];
        }
    }
}