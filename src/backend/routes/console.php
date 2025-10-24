<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule; 

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


// --- 2. ADD YOUR SCHEDULE DEFINITION HERE ---
Schedule::command('ads:calculate-daily-count')->dailyAt('21:05');
