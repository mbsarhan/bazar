<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\ResetPasswordWithOtp;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class PasswordResetService
{
    /**
     * Step 1: Send a password reset code to the user's email.
     */
    public function sendResetCode(string $email): array
    {
        $user = User::where('email', $email)->firstOrFail();
        $code = random_int(100000, 999999);

        // We reuse the existing verification_code columns.
        $user->forceFill([
            'verification_code' => $code,
            'verification_code_expires_at' => now()->addMinutes(10),
        ])->save();

        $user->notify(new ResetPasswordWithOtp((string)$code));

        return ['message' => 'تم إرسال كود التحقق من أجل تغيير كلمة المرور إلى الإيمل الخاص بك'];
    }

    /**
     * Step 2: Verify that the provided code is valid.
     */
    public function verifyResetCode(string $email, string $code): array
    {
        $user = User::where('email', $email)->firstOrFail();
        
        if (is_null($user->verification_code) || $user->verification_code !== $code || $user->verification_code_expires_at->isBefore(now())) {
            throw ValidationException::withMessages([
                'code' => ['رمز التحقق غير صالح او انتهت مدته! الرجاء إعادة طلب رمز التحقق'],
            ]);
        }
        
        // The code is valid, but we don't clear it yet.
        // It's needed for the final password reset step as a security measure.
        return ['message' => 'رمز التحقق صحيح, يمكنك الآن تغيير كلمة المرور'];
    }

    /**
     * Step 3: Reset the user's password.
     */
    public function resetPassword(string $email, string $code, string $newPassword): array
    {
        $user = User::where('email', $email)->firstOrFail();
    
        // Re-verify the code one last time before changing the password.
        if (is_null($user->verification_code) || $user->verification_code !== $code || $user->verification_code_expires_at->isBefore(now())) {
            throw ValidationException::withMessages([
                'code' => ['رمز التحقق غير صالح او انتهت مدته! الرجاء إعادة طلب رمز التحقق'],
            ]);
        }

        // Update the password and clear the verification code.
        $user->forceFill([
            'password' => Hash::make($newPassword),
            'verification_code' => null,
            'verification_code_expires_at' => null,
        ])->save();

        return ['message' => 'تم تغيير كلمة المرور بنجاح!'];
    }
}