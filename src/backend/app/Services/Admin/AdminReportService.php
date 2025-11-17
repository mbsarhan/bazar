<?php

namespace App\Services\Admin;

use App\Models\User;
use App\Models\UserReport;
use App\Services\PenaltyService; // Important: We inject the PenaltyService
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdminReportService
{
    protected PenaltyService $penaltyService;

    // We use constructor injection to get an instance of the PenaltyService.
    public function __construct(PenaltyService $penaltyService)
    {
        $this->penaltyService = $penaltyService;
    }

    /**
     * Get a paginated list of user reports for the admin panel.
     * Includes relationships for display.
     *
     * @param array $filters (e.g., status, search term)
     * @return LengthAwarePaginator
     */
    public function getReports(array $filters): LengthAwarePaginator
    {
        $query = UserReport::query()
            ->with(['reporter:id,fname,lname', 'reported:id,fname,lname']); // Eager load users

        // Apply status filter
        if (!empty($filters['status']) && in_array($filters['status'], ['pending', 'approved', 'dismissed'])) {
            $query->where('status', $filters['status']);
        }
        
        // (We can add search filters here later if needed)

        return $query->latest()->paginate(15);
    }

    /**
     * Process a report (approve or dismiss).
     *
     * @param UserReport $report The report to process.
     * @param User $admin The admin performing the action.
     * @param string $action The action to take ('approve' or 'dismiss').
     * @param string|null $reviewNote Optional notes from the admin.
     * @return UserReport The updated report.
     */
    public function processReport(UserReport $report, User $admin, string $action, ?string $reviewNote): UserReport
    {
        // Prevent processing an already-processed report.
        if ($report->status !== 'pending') {
            return $report;
        }

        if ($action === 'approve') {
            // --- This is where the magic happens ---
            // 1. Call the PenaltyService to apply a strike to the reported user.
            $this->penaltyService->applyStrike($report->reported, $admin, $report);

            // 2. Update the report's status.
            $report->status = 'approved';

        } else { // 'dismiss' action
            $report->status = 'dismissed';
        }

        // 3. Log the admin's action on the report itself.
        $report->reviewed_by = $admin->id;
        $report->reviewed_at = now();
        $report->review_note = $reviewNote;
        $report->save();
        
        return $report;
    }
}