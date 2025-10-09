<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\VerifyPasswordRequest; // <-- 1. IMPORT
use App\Services\UserService;
use Illuminate\Support\Facades\Hash; // <-- 2. IMPORT
use Illuminate\Validation\ValidationException; // <-- 3. IMPORT
use App\Http\Requests\UpdateProfileRequest; // <-- 1. IMPORT

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
}