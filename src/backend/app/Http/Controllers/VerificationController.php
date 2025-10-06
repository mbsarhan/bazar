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

        $this->middleware('auth:sanctum')->only('resend');
        $this->middleware('throttle:6,1')->only('resend');
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
        /** @var \App\Models\User $user */
        $user = $request->user();

        // Delegate to the service
        $result = $this->verificationService->resendVerification($user);

        return response()->json($result, 200);
    }

}