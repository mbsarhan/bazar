<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserReport;
use App\Services\Admin\AdminReportService;
use App\Http\Resources\Admin\UserReportResource;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminReportController extends Controller
{
    protected AdminReportService $adminReportService;

    public function __construct(AdminReportService $adminReportService)
    {
        $this->adminReportService = $adminReportService;
    }

    /**
     * Display a paginated listing of user reports.
     */
    public function index(Request $request)
    {
        // Simple validation for the status filter
        $filters = $request->validate([
            'status' => ['nullable', 'string', Rule::in(['pending', 'approved', 'dismissed'])],
        ]);

        $reports = $this->adminReportService->getReports($filters);

        // Return a collection of reports formatted by our new resource
        return UserReportResource::collection($reports);
    }

    /**
     * Process a specific user report (approve or dismiss).
     */
    public function process(Request $request, UserReport $report)
    {
        // Validate the incoming action and optional notes
        $data = $request->validate([
            'action' => ['required', 'string', Rule::in(['approve', 'dismiss'])],
            'review_note' => ['nullable', 'string', 'max:1000'],
        ]);

        $admin = $request->user();

        // Delegate the core logic to the service
        $updatedReport = $this->adminReportService->processReport(
            $report,
            $admin,
            $data['action'],
            $data['review_note'] ?? null
        );

        // Return the updated report, formatted by our resource
        return new UserReportResource($updatedReport);
    }
}