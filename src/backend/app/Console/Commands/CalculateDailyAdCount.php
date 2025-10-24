<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Advertisement;
use App\Models\DailyAdCount;
use Carbon\Carbon; 

class CalculateDailyAdCount extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ads:calculate-daily-count {--date=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Calculates the number of ads from the previous day and saves it to the summary table.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // 1. Check if the user provided a --date option.
        $inputDate = $this->option('date');
        if ($inputDate) {
            // If a date was provided (e.g., "7 days ago"), parse it using Carbon.
            $dateToCalculate = Carbon::parse($inputDate);
        } else {
            // If no date was provided, default to yesterday.
            $dateToCalculate = now()->subDay();
        }
        
        $dateString = $dateToCalculate->toDateString(); 
        $this->info("Calculating daily ad count for: {$dateString}...");

        $count = Advertisement::whereDate('created_at', $dateToCalculate)->count();

        // Use updateOrCreate to either create a new record or update an existing one for that date.
        DailyAdCount::updateOrCreate(
            ['date' => $dateToCalculate],
            ['ad_count' => $count]
        );

        $this->info("Successfully calculated and saved {$count} ads for {$dateToCalculate}.");
        return 0;
    }
}
