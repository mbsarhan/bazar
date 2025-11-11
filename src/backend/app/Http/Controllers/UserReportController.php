<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UserReportService;
use App\Http\Requests\StoreUserReportRequest;
use Illuminate\Http\JsonResponse;

class UserReportController extends Controller
{
    protected UserReportService $userReportService;

    public function __construct(UserReportService $userReportService)
    {
        $this->userReportService = $userReportService;
    }

    /**
     * Store a new report against a user.
     *
     * @param StoreUserReportRequest $request
     * @param User $user The user being reported (from route-model binding).
     * @return JsonResponse
     */
    public function store(StoreUserReportRequest $request, User $user): JsonResponse
    {
        // The StoreUserReportRequest has already validated the data and
        // authorized that the user is not reporting themselves.

        $reporter = $request->user(); // The authenticated user.

        $this->userReportService->createReport($reporter, $user, $request->validated());

        return response()->json([
            'message' => 'تم إرسال بلاغك بنجاح. سيقوم فريقنا بمراجعته.',
        ], 201); // 201 Created
    }
}