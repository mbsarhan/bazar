<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserReport;
use Carbon\Carbon;

class PenaltyService
{
    // Define the escalating ban durations. Easy to change here later.
    const BAN_DURATIONS = [
        1 => 1,    // 1st strike = 1 day ban
        2 => 7,    // 2nd strike = 7 day ban
        3 => null, // 3rd strike = Permanent ban (null means forever)
    ];

    /**
     * Applies a penalty strike to a user.
     * This increments their strike count, creates a strike record,
     * and applies a ban based on the new strike count.
     *
     * @param User $user The user receiving the strike.
     * @param User $admin The admin issuing the strike.
     * @param UserReport $report The report that led to this strike.
     * @return void
     */
    public function applyStrike(User $user, User $admin, UserReport $report): void
    {
        // 1. Increment the strike count on the user's record.
        // We use increment() to avoid race conditions.
        $user->increment('strike_count');
        $newStrikeCount = $user->strike_count;

        // 2. Create an audit trail record in the user_strikes table.
        $user->strikes()->create([
            'report_id' => $report->id,
            'admin_id' => $admin->id,
            'reason' => "Violation based on report #{$report->id}: {$report->reason}",
        ]);

        // 3. Determine the ban duration based on the new strike count.
        $banDays = self::BAN_DURATIONS[$newStrikeCount] ?? null; // Default to permanent for 3+ strikes

        // 4. Apply the ban to the user.
        if (is_numeric($banDays)) {
            // A temporary ban
            $user->banned_until = Carbon::now()->addDays($banDays);
        } else {
            // A permanent ban (set to a far-future date for clarity)
            $user->banned_until = Carbon::now()->addYears(10);
        }

        $user->save();
    }
}