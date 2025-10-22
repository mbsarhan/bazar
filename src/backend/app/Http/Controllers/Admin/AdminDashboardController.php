<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\Admin\AdminDashboardService;

class AdminDashboardController extends Controller
{
    protected AdminDashboardService $admindashboardService;

    public function __construct(AdminDashboardService $admindashboardService)
    {
        $this->admindashboardService = $admindashboardService;
    }

    /**
     * Get statistics for the admin dashboard.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStatistics(Request $request)
    {
        // --- CRITICAL SECURITY CHECK ---
        // Ensure the authenticated user is an admin.
        // We assume you have an 'admin' boolean column on your User model.
        if (!$request->user()->admin) {
            return response()->json([
                'message' => 'Unauthorized. You do not have admin privileges.'
            ], 403); // 403 Forbidden is the correct status code.
        }

        // Delegate the logic to the service.
        $statistics = $this->admindashboardService->getStatistics();

        // Return the statistics as a JSON response.
        return response()->json($statistics);
    }
}