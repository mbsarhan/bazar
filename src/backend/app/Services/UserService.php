<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException; // <-- IMPORT
use Exception;

class UserService
{
    /**
     * Update the user's password.
     */
    public function updatePassword(User $user, string $newPassword): array
    {
        try {
            // --- ADD THIS CHECK ---
            // Manually check if the new password is the same as the old one.
            if (Hash::check($newPassword, $user->password)) {
                throw ValidationException::withMessages([
                    'password' => ['لا يمكنك استخدام كلمة المرور القديمة ككلمة مرور جديدة.'],
                ]);
            }

            // If the check passes, update the password.
            $user->password = Hash::make($newPassword);
            $user->save();

            return [
                'message' => 'تم تغيير كلمة المرور بنجاح!',
            ];

        } catch (ValidationException $e) {
            // Rethrow validation exceptions so the controller can generate a 422 response.
            throw $e;
        } catch (Exception $e) {
            Log::error('Password update failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'message' => 'حدث خطأ أثناء تحديث كلمة المرور.',
            ];
        }
    }
}