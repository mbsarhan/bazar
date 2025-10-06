<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request; // We'll pass parts of the request, not the whole object, for cleaner service logic.

class VerificationService
{

    public function verifyOtp(string $email, string $code): array
    {
        
        $user = User::where('email', $email)->first();

        // 1. Check if user exists and has an email to verify
        if (! $user || ! $user->email) {
            // Throw a ValidationException here to standardize error handling upstream
            throw ValidationException::withMessages([
                'email' => ['User not found or does not have an email to verify.'],
            ])->status(404); // Optionally set status code if you want to differentiate
        }

        // 2. Check if email is already verified
        if ($user->hasVerifiedEmail()) {
            return ['message' => 'Email already verified.'];
        }

        // 3. Check if the provided code matches the stored code
        if ($user->verification_code !== $code) {
            throw ValidationException::withMessages([
                'code' => ['رمز التحقق غير صحيح.'],
            ]);
        }

        // 4. Check if the code has expired
        if ($user->verification_code_expires_at === null || $user->verification_code_expires_at->isBefore(now())) {
            // Clear the code and expiry as it's no longer valid
            $user->forceFill([
                'verification_code' => null,
                'verification_code_expires_at' => null,
            ])->save();

            throw ValidationException::withMessages([
                'code' => ['رمز التحقق منتهي الصلاحية. الرجاء طلب رمز جديد.'],
            ]);
        }

        // 5. Mark the email as verified and clear verification code fields
        if ($user->markEmailAsVerified()) {
            // Also clear the OTP code and expiry after successful verification
            $user->forceFill([
                'verification_code' => null,
                'verification_code_expires_at' => null,
            ])->save();

            event(new Verified($user));
        }

        return ['message' => 'تم التحقق من الإيميل بنجاح'];
    }

    public function resendVerification(User $user): array
    {
        // If user has no email, they cannot request email verification
        if (! $user->email) {
            throw ValidationException::withMessages([
                'email' => ['You do not have an email address to verify.'],
            ])->status(400);
        }

        // If email is already verified
        if ($user->hasVerifiedEmail()) {
            return ['message' => 'Email already verified.'];
        }

        // Send new verification link (this will generate a new OTP, save it, and send the email)
        $user->sendEmailVerificationNotification();

        return ['message' => 'Verification link sent! Please check your email.'];
    }


}