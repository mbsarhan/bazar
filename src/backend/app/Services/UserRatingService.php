<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserRating;
use Illuminate\Support\Facades\DB;
use Exception;

class UserRatingService
{
    /**
     * Creates or updates a rating for a user and recalculates their average review score.
     *
     * @param User $rater The user giving the rating.
     * @param int $ratedUserId The ID of the user being rated.
     * @param int $rating The rating value (1-5).
     * @param string|null $message The optional review message.
     * @return array
     * @throws Exception
     */
    public function rateUser(User $rater, int $ratedUserId, int $rating, ?string $message): array
    {
        // If updating the user's score fails, the rating itself will be rolled back.
        return DB::transaction(function () use ($rater, $ratedUserId, $rating, $message) {
            
            //  Find the user who is being rated.
            $ratedUser = User::findOrFail($ratedUserId);

            // This prevents a user from rating the same person multiple times.
            UserRating::updateOrCreate(
                ['rater_id' => $rater->id, 'rated_id' => $ratedUserId],
                ['rating' => $rating, 'message' => $message]
            );


            $newAverage = UserRating::where('rated_id', $ratedUserId)->avg('rating');

            // Update the 'review' field on the user's record.
            $ratedUser->update(['review' => $newAverage]);

            return [
                'message' => 'User rated successfully.',
                'new_average_review' => round($newAverage, 1) // Return the rounded average
            ];
        });
    }
}