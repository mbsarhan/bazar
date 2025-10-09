<?php

namespace App\Http\Controllers;




use Illuminate\Http\Request;
use App\Services\DashboardService;


class DashboardController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Get statistics for the dashboard.
     */
    public function getStatistics(Request $request)
    {
        // Get the authenticated user from the request
        $user = $request->user();

        // Call the service to get the aggregated data
        $statistics = $this->dashboardService->getStatistics($user);

        // Return the data as a JSON response
        return response()->json($statistics);
    }
}
