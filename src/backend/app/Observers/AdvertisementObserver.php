<?php

namespace App\Observers;

use App\Models\DailyAdCount;
use App\Models\Advertisement;

class AdvertisementObserver
{
    /**
     * Handle the Advertisement "created" event.
     */
    public function created(Advertisement $advertisement): void
    {
        // Get today's date as a string (e.g., '2025-10-24')
        $today = now()->toDateString();

        // Find the record for today, or create it if it doesn't exist.
        // Then, atomically increment the 'ad_count' by 1.
        // This is safe from race conditions.
        DailyAdCount::firstOrCreate(['date' => $today])->increment('ad_count');
    }

    /**
     * Handle the Advertisement "updated" event.
     */
    public function updated(Advertisement $advertisement): void
    {
        //
    }

    /**
     * Handle the Advertisement "deleted" event.
     */
    public function deleted(Advertisement $advertisement): void
    {
        // Get the date the ad was originally created on.
        $adCreationDate = $advertisement->created_at->toDateString();

        // Find the summary record for that specific day.
        $dailyCount = DailyAdCount::where('date', $adCreationDate)->first();

        // If a record exists and the count is greater than 0, decrement it.
        if ($dailyCount && $dailyCount->ad_count > 0) {
            $dailyCount->decrement('ad_count');
        }
    }

    /**
     * Handle the Advertisement "restored" event.
     */
    public function restored(Advertisement $advertisement): void
    {
        //
    }

    /**
     * Handle the Advertisement "force deleted" event.
     */
    public function forceDeleted(Advertisement $advertisement): void
    {
        //
    }
}
