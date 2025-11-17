<?php

namespace App\Services;

use Exception;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;


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

            // --- THIS IS THE CORRECT, ENHANCED BAN CHECK ---
        // We use the isBanned() helper method to correctly check for active bans.
        if ($user->isBanned()) {
            $bannedUntil = $user->banned_until;
            $message = 'حسابك موقوف.';
            $isPermanent = $bannedUntil->isAfter(Carbon::now()->addYears(5)); // Check for permanent ban

            if ($isPermanent) {
                $message = 'تم تعليق حسابك بشكل دائم لمخالفة شروط الخدمة.';
            } else {
                // Give the user a clear, localized message with the expiry date.
                $formattedDate = $bannedUntil->translatedFormat('j F Y, h:i A');
                $message = 'حسابك موقوف بشكل مؤقت. سيتم رفع التعليق بتاريخ: ' . $formattedDate;
            }

            // Throw the professional error message.
            throw ValidationException::withMessages([
                'credential' => [$message],
            ]);
        }
        // --- END OF BAN CHECK ---

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