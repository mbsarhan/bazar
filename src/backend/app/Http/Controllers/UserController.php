<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UpdatePasswordRequest;
use App\Services\UserService;

class UserController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Update the authenticated user's password.
     */
    public function updatePassword(UpdatePasswordRequest $request)
    {
        // The UpdatePasswordRequest has already validated the current and new passwords.
        // We just need to get the authenticated user.
        $user = $request->user();

        // Call the service with the user and the new password.
        $response = $this->userService->updatePassword($user, $request->password);

        return response()->json($response);
    }
}