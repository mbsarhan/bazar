<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Requests\VerifyPasswordResetCodeRequest;
use App\Services\PasswordResetService;


class PasswordResetController extends Controller
{
    protected PasswordResetService $passwordResetService;

    public function __construct(PasswordResetService $passwordResetService)
    {
        $this->passwordResetService = $passwordResetService;
    }

    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $response = $this->passwordResetService->sendResetCode($request->validated()['email']);
        return response()->json($response);
    }

    public function verifyCode(VerifyPasswordResetCodeRequest $request)
    {
        $validated = $request->validated();
        $response = $this->passwordResetService->verifyResetCode($validated['email'], $validated['code']);
        return response()->json($response);
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        $validated = $request->validated();
        $response = $this->passwordResetService->resetPassword($validated['email'], $validated['code'], $validated['password']);
        return response()->json($response);
    }
}