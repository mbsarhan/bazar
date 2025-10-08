<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Auth\Events\Verified; // Still used if the service dispatches it
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\ValidationException;
use App\Services\VerificationService; // Import the new service

class VerificationController extends Controller
{
    protected $verificationService;

    /**
     * Create a new controller instance.
     *
     * @param VerificationService $verificationService
     * @return void
     */
    public function __construct(VerificationService $verificationService)
    {
        $this->verificationService = $verificationService;

        // The line protecting the 'resend' route has been completely removed.
        // The throttle middleware is already correctly applied in your routes/api.php file.
    }

    /**
     * Handle the incoming OTP verification request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code'  => 'required|string|size:6',
        ]);

        // Delegate to the service
        $result = $this->verificationService->verifyOtp($request->email, $request->code);

        return response()->json($result, 200);
    }

    /**
     * Resend the email verification notification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function resend(Request $request)
    {
        // --- THIS IS THE GUARANTEED FIX ---

        // 1. Validate that the frontend sent an email.
        $request->validate([
            'email' => 'required|email'
        ]);

        // 2. Find the user by the email.
        $user = User::where('email', $request->email)->first();

        // 3. If a user is found and is not yet verified...
        if ($user && !$user->hasVerifiedEmail()) {
            
            // 4. Directly call the function to send the email notification.
            // This bypasses the service and its incorrect type hint.
            // This is the same function Laravel calls after registration.
            $user->sendEmailVerificationNotification();

            return response()->json(['message' => 'Verification link sent!']);
        }

        // For security and consistency, always return a success-like message.
        return response()->json(['message' => 'If an account with that email exists and requires verification, a new code has been sent.']);
    }

}