<?php

namespace App\Http\Controllers;


use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Services\EmailChangeService;
use App\Http\Requests\EmailChangeRequest;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\VerifyEmailChangeRequest;

class EmailChangeController extends Controller
{
    protected EmailChangeService $emailChangeService;

    public function __construct(EmailChangeService $emailChangeService)
    {
        $this->emailChangeService = $emailChangeService;
    }

    public function requestChange(EmailChangeRequest $request)
    {
        $response = $this->emailChangeService->requestEmailChange(
            $request->user(),
            $request->validated()['email']
        );
        // Return a simple, flat response
        return response()->json($response);
    }

    public function verifyChange(VerifyEmailChangeRequest $request)
    {
        $response = $this->emailChangeService->verifyEmailChange(
            $request->user(),
            $request->validated()['code']
        );
        // Return a simple, flat response
        return response()->json($response);
    }



    // Your resendChange method is well-structured, but let's simplify its response too.
    public function resendChange(Request $request)
    {
        try {
            $response = $this->emailChangeService->resendEmailChangeVerification($request->user());
            return response()->json($response);
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage(), 'errors' => $e->errors()], 422);
        } catch (Exception $e) {
            return response()->json(['message' => 'An internal server error occurred.'], 500);
        }
    }
}
