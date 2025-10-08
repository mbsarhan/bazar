<?php

namespace App\Http\Controllers;


use App\Http\Controllers\Controller;
use App\Http\Requests\RequestEmailChangeRequest;
use App\Http\Requests\VerifyEmailChangeRequest;
use App\Services\EmailChangeService;

class EmailChangeController extends Controller
{
    protected EmailChangeService $emailChangeService;

    public function __construct(EmailChangeService $emailChangeService)
    {
        $this->emailChangeService = $emailChangeService;
    }

    public function requestChange(RequestEmailChangeRequest $request)
    {
        $response = $this->emailChangeService->requestEmailChange(
            $request->user(),
            $request->validated()['email']
        );
        return response()->json([
            'success' => true,
            'message' => 'Verification code sent',
            'data' => $response
        ]);
    }

    public function verifyChange(VerifyEmailChangeRequest $request)
    {
        $response = $this->emailChangeService->verifyEmailChange(
            $request->user(),
            $request->validated()['code']
        );
        
        return response()->json([
            'success' => true,
            'message' => 'Verification code sent',
            'data' => $response
        ]);
    }
}
