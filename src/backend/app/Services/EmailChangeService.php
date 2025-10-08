<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\VerifyEmailWithOtp;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\ValidationException;

class EmailChangeService
{
    /**
     * Initiates the email change process.
     */
    public function requestEmailChange(User $user, string $newEmail): array
    {
        $verificationCode = random_int(100000, 999999);

        $user->forceFill([
            'pending_email' => $newEmail,
            'pending_email_verification_code' => $verificationCode,
            'pending_email_expires_at' => now()->addMinutes(10),
        ])->save();

        Notification::route('mail', $newEmail)
            ->notify(new VerifyEmailWithOtp((string)$verificationCode));
            

        return ['message' => 'A verification code has been sent to your new email address.'];
    }

    /**
     * Verifies the code and completes the email change.
     */
    public function verifyEmailChange(User $user, string $verificationCode): array
    {
        // 1. Validate the pending request
        if (is_null($user->pending_email) || $user->pending_email_verification_code !== $verificationCode || $user->pending_email_expires_at->isBefore(now())) {
            // Clear any invalid/expired data
            $this->clearPendingChange($user);
            throw ValidationException::withMessages([
                'code' => ['The verification code is invalid or has expired.'],
            ]);
        }
        
        // 2. If valid, update the email and clear pending data
        $user->forceFill([
            'email' => $user->pending_email,
            'email_verified_at' => now(),
        ])->save();
        
        $this->clearPendingChange($user);

        return ['message' => 'Your email address has been updated successfully.'];
    }
    
    /**
     * Helper to clear pending change data from the user model.
     */
    private function clearPendingChange(User $user): void
    {
         $user->forceFill([
            'pending_email' => null,
            'pending_email_verification_code' => null,
            'pending_email_expires_at' => null,
        ])->save();
    }
}