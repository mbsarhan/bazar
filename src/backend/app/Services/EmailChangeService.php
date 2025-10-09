<?php

namespace App\Services;

use Exception;
use App\Models\User;
use Illuminate\Support\Facades\Log;
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
        try {
            if ($user->email == $newEmail) {
            throw ValidationException::withMessages([
                'email' => ['البريد الإلكتروني الجديد لا يمكن أن يكون هو نفسه بريدك الإلكتروني الحالي.'],
            ]);
        }
            Log::info('Attempting to initiate email change for User ID: ' . $user->id, ['new_email' => $newEmail]);

            // 1. Generate code
            $verificationCode = random_int(100000, 999999);

            // 2. Prepare and save pending data
            $user->forceFill([
                'pending_email' => $newEmail,
                'pending_email_verification_code' => $verificationCode,
                'pending_email_expires_at' => now()->addMinutes(10),
            ]);

            $dbUpdated = $user->save(); // Save the result of the save operation

            if (!$dbUpdated) {
                // Log if the database save failed (e.g., integrity constraint, permissions, etc.)
                Log::error('DATABASE SAVE FAILED for pending email change.', ['user_id' => $user->id, 'new_email' => $newEmail]);
            } else {
                Log::info('Database updated successfully with pending email data.', ['user_id' => $user->id, 'pending_email' => $newEmail]);
            }

            // 3. Send the verification code to the new email
            Log::info('Attempting to send verification email to: ' . $newEmail);
            
            // This sends the notification to the new email address
            Notification::route('mail', $newEmail)
                ->notify(new VerifyEmailWithOtp((string)$verificationCode));
                
            Log::info('Notification call finished.');


            return ['message' => 'A verification code has been sent to your new email address.'];

        } catch (Exception $e) {
            // Log any unexpected exceptions (e.g., database connection error, mailer exception)
            Log::error('Email change request failed with unexpected exception.', [
                'user_id' => $user->id,
                'new_email' => $newEmail,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            // Re-throw a generic exception to be caught and handled by the Controller
            throw new Exception('Failed to process email change request due to an internal error.');
        }
    }

    /**
     * Verifies the code and completes the email change.
     */
    public function verifyEmailChange(User $user, string $verificationCode): array
    {
        // 1. Check if there is a pending request at all
        if (is_null($user->pending_email)) {
            throw ValidationException::withMessages([
                'code' => ['There is no pending email change request.'],
            ]);
        }
        
        // 2. Check for expiration - If expired, clear data and inform the user
        if ($user->pending_email_expires_at->isBefore(now())) {
            // Clear the pending data if it's expired
            $this->clearPendingChange($user); 
            throw ValidationException::withMessages([
                'code' => ['The verification code has expired. Please request a new email change.'],
            ]);
        }

        // 3. Check the code itself - If incorrect but not expired, only throw an error
        // The pending data remains, allowing the user to try again.
        if ($user->pending_email_verification_code !== $verificationCode) {
            throw ValidationException::withMessages([
                'code' => ['The verification code is incorrect. Please try again.'],
            ]);
        }

        // 4. If valid, update the email and clear pending data (Success path)
        $user->forceFill([
            'email' => $user->pending_email,
            'email_verified_at' => now(),
        ])->save();
        
        $this->clearPendingChange($user);

        return ['message' => 'Your email address has been updated successfully.'];
    }

    public function resendEmailChangeVerification(User $user): array
    {
        // 1. Check if there is actually a pending email change to resend for.
        if (is_null($user->pending_email)) {
            throw ValidationException::withMessages([
                'email' => ['You do not have a pending email change request.'],
            ]);
        }

        try {
            // 2. Generate a new verification code.
            $newVerificationCode = random_int(100000, 999999);

            // 3. Update the user record with the new code and a new 10-minute expiry time.
            $user->forceFill([
                'pending_email_verification_code' => $newVerificationCode,
                'pending_email_expires_at' => now()->addMinutes(10),
            ])->save();

            // 4. Send the new code to the pending email address.
            Notification::route('mail', $user->pending_email)
                ->notify(new VerifyEmailWithOtp((string)$newVerificationCode));

            return ['message' => 'A new verification code has been sent to your pending email address.'];

        } catch (Exception $e) {
            Log::error('Resending email change code failed.', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            
            throw new Exception('Failed to resend verification code due to an internal error.');
        }
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