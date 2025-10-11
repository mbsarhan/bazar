<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException; // <-- IMPORT
use Carbon\Carbon; // <-- 1. IMPORT CARBON FOR DATE MANIPULATION
use Exception;
use App\Models\UserRating; // <-- IMPORT
use Illuminate\Support\Facades\DB; // <-- IMPORT
use Ramsey\Uuid\Type\Integer;

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
    /**
     * Update the user's profile information (e.g., name).
     */
    public function updateProfile(User $user, array $data): User
    {
        try {
            // --- 2. ADD THE RATE LIMITING LOGIC ---
            // Check if the name was updated within the last 7 days.
            if ($user->name_last_updated_at && $user->name_last_updated_at->addDays(7)->isFuture()) {
                // Calculate how many days are remaining.
                $daysRemaining = floor(Carbon::now()->diffInDays($user->name_last_updated_at->addDays(7), false));

                throw ValidationException::withMessages([
                    // Use 'fname' as the key to display the error on the form.
                    'fname' => "لا يمكنك تغيير اسمك مرة أخرى قبل مرور " . ($daysRemaining + 1) . " أيام.",
                ]);
            }

            // --- 3. UPDATE THE USER'S INFO AND THE TIMESTAMP ---
            $user->update([
                'fname' => $data['fname'],
                'lname' => $data['lname'],
                'name_last_updated_at' => now(), // Set the timestamp to the current time
            ]);

            return $user;

        } catch (ValidationException $e) {
            // Rethrow validation exceptions to be handled by the controller
            throw $e;
        } catch (Exception $e) {
            Log::error('Profile update failed', [ 'user_id' => $user->id, 'error' => $e->getMessage() ]);
            throw $e;
        }
    }



    /**
     * Get all review data for a specific user.
     * This is the new, simpler, and more efficient version.
     */
    public function getReviewData(User $user): array
    {
        try {
            // 1. Get the pre-calculated average directly from the user's 'review' column.
            $averageRating = $user->review;

            // 2. Perform a simple, fast count of the total reviews received.
            $totalReviews = UserRating::where('rated_id', $user->id)->count();

            // 3. Fetch the paginated list of individual reviews.
            $reviews = UserRating::where('rated_id', $user->id)
                                 ->with('rater:id,fname,lname') // Eager-load the reviewer's name
                                 ->latest()
                                 ->paginate(10); // Paginate for performance

            return [
                'averageRating' => $averageRating,
                'totalReviews'  => $totalReviews,
                'reviews'       => $reviews,
            ];

        } catch (Exception $e) {
            // Log the detailed error for debugging.
            Log::error('Failed to get review data for user.', [
                'user_id' => $user->id,
                'error'   => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
            ]);
            // Re-throw the exception to be handled by the controller.
            throw new Exception("An internal server error occurred while fetching review data.");
        }
    }
}