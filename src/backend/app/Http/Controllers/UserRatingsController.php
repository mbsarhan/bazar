<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Services\UserRatingService;
use App\Http\Requests\RateUserRequest;

class UserRatingsController extends Controller
{
    protected UserRatingService $userRatingService;
    public function __construct(UserRatingService $userRatingService)
    {
        $this->userRatingService = $userRatingService;
    }

    public function store(RateUserRequest $request)
    {
        try {
            $rater = $request->user();
            $validatedData = $request->validated();

            $result = $this->userRatingService->rateUser(
                $rater,
                $validatedData['rated_user_id'],
                $validatedData['rating'],
                $validatedData['message'] ?? null
            );

            return response()->json($result, 200); // 200 OK is suitable for create or update

        } catch (Exception $e) {
            // This will catch errors from the service, like if the transaction fails.
            return response()->json([
                'message' => 'An error occurred while processing your rating.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
