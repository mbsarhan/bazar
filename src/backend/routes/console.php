<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


// --- ADD THIS NEW SCHEDULE ---
// Run the user pruning command every day at a different time (e.g., 1 AM).
Schedule::command('users:prune-unverified')->dailyAt('21:00');


// --- ADD THIS NEW SCHEDULE ---
// Run the pending email pruning command every day.
Schedule::command('users:prune-unverified-pending-emails')->dailyAt('21:00');