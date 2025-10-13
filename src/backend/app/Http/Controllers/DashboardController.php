<?php

namespace App\Http\Controllers;




use Illuminate\Http\Request;
use App\Services\DashboardService;
use Illuminate\Validation\Rule;

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



    /**
     * Get time-series view data for the dashboard chart.
     */
    public function getViews(Request $request)
    {
        // Validate the 'range' query parameter
        $validated = $request->validate([
            'range' => ['required', Rule::in(['days', 'weeks'])],
        ]);

        $user = $request->user();
        $range = $validated['range'];

        $viewData = $this->dashboardService->getViewsData($user, $range);

        return response()->json($viewData);
    }
}
