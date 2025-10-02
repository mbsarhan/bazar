<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Exception;

class UserService
{
    /**
     * Update the user's password.
     *
     * @param User $user The authenticated user model.
     * @param string $newPassword The new, validated password.
     * @return array The response array.
     */
    public function updatePassword(User $user, string $newPassword): array
    {
        try {
            $user->password = Hash::make($newPassword);
            $user->save();

            return [
                'message' => 'تم تغيير كلمة المرور بنجاح!',
            ];
        } catch (Exception $e) {
            Log::error('Password update failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'message' => 'حدث خطأ أثناء تحديث كلمة المرور.',
                'error'   => $e->getMessage(),
            ];
        }
    }
}