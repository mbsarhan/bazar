<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\VerifyPasswordRequest; // <-- 1. IMPORT
use App\Services\UserService;
use Illuminate\Support\Facades\Hash; // <-- 2. IMPORT
use Illuminate\Validation\ValidationException; // <-- 3. IMPORT
use App\Http\Requests\UpdateProfileRequest; // <-- 1. IMPORT
use App\Http\Resources\ReviewResource; // <-- IMPORT
use Illuminate\Support\Facades\Log; // 1. IMPORT
use Exception; // 2. IMPORT

class UserController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }



    /**
     * Verify the user's current password.
     */
    public function verifyPassword(VerifyPasswordRequest $request)
    {
        $user = $request->user();
        $password = $request->password;

        // Check if the provided password matches the user's current password
        if (!Hash::check($password, $user->password)) {
            // If it doesn't match, throw a validation error
            throw ValidationException::withMessages([
                'password' => ['كلمة المرور غير صحيحة.'],
            ]);
        }

        // If it matches, return a success response
        return response()->json(['message' => 'Password verified successfully.']);
    }



    /**
     * Update the authenticated user's password.
     */
    public function updatePassword(UpdatePasswordRequest $request)
    {
        // The request class has already validated the new password format and confirmation.
        $user = $request->user();

        // The service will handle the logic of checking against the old password and saving.
        $response = $this->userService->updatePassword($user, $request->password);

        return response()->json($response);
    }

    
    /**
     * Update the authenticated user's profile information.
     */
    public function updateProfile(UpdateProfileRequest $request)
    {
        // The request class has already validated the data.
        $user = $request->user();

        // Call the service to perform the update.
        $updatedUser = $this->userService->updateProfile($user, $request->validated());

        // Return the updated user object.
        return response()->json($updatedUser);
    }


    /**
     * Get the review data for the authenticated user.
     */
    public function getReviews(Request $request)
    {
        try {
            $user = $request->user();

            // 1. Call the service to get the raw data
            $reviewData = $this->userService->getReviewData($user);

            // 2. Return the data, formatting the 'reviews' array through our resource
            return response()->json([
                'averageRating' => $reviewData['averageRating'],
                'totalReviews'  => $reviewData['totalReviews'],
                'reviews'       => ReviewResource::collection($reviewData['reviews']),
            ]);

        } catch (Exception $e) {
            // This will catch the exception thrown from the service
            // and return a clean 500 error instead of crashing the app.
            return response()->json([
                'message' => 'An error occurred while retrieving your reviews.',
                // In production, you might want to hide the detailed error message.
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}