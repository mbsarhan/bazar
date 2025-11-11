<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserReport;
use Illuminate\Validation\ValidationException;

class UserReportService
{
    /**
     * Create a new report against a user.
     *
     * @param User $reporter The user submitting the report.
     * @param User $reportedUser The user being reported.
     * @param array $data The validated report data (reason, description).
     * @return UserReport
     */
    public function createReport(User $reporter, User $reportedUser, array $data): UserReport
    {
        // Best Practice: Prevent a user from spamming reports.
        // Check if an open report from this reporter to this reported user already exists.
        $existingReport = UserReport::where('reporter_id', $reporter->id)
            ->where('reported_id', $reportedUser->id)
            ->exists();

        if ($existingReport) {
            // Throw a validation exception that will be converted to a 422 JSON response.
            throw ValidationException::withMessages([
                'general' => 'لقد قمت بالإبلاغ عن هذا المستخدم من قبل.',
            ]);
        }

        // Create the report record in the database.
        return UserReport::create([
            'reporter_id' => $reporter->id,
            'reported_id' => $reportedUser->id,
            'reason' => $data['reason'],
            'description' => $data['description'],
        ]);
    }
}