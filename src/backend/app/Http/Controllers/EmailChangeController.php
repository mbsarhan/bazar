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
        if (!$request->user()) {
        // If we get this error, it means authentication is failing.
        abort(401, 'User not authenticated.'); 
    }
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
            'message' => 'Email address updated successfully',
            'data' => $response
        ]);
    }


    public function resendChange(Request $request)
    {
        try {
            $response = $this->emailChangeService->resendEmailChangeVerification($request->user());
            
            return response()->json([
                'success' => true,
                'message' => 'تم إرسال كود التحقق الجديد',
                'data' => $response
            ]);

        } catch (ValidationException $e) {
            // Catch the specific validation error from the service (e.g., no pending request)
            return response()->json([
                'message' => 'لا يمكن إعادة إرسال الكود',
                'errors' => $e->errors(),
            ], 422);

        } catch (Exception $e) {
            // Catch any other unexpected errors
            return response()->json([
                'success' => false,
                'message' => 'مشكلة في السيرفر',
            ], 500);
        }
    }
}
