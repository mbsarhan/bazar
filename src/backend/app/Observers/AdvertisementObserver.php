<?php

namespace App\Observers;

use App\Models\DailyAdCount;
use App\Models\Advertisement;
use Illuminate\Support\Facades\Storage;

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


        if ($advertisement->realEstateDetails) {
            
            $details = $advertisement->realEstateDetails;

            // 2. Delete the original uploaded video file, if the path still exists.
            // (It might have already been deleted by the ProcessVideoJob).
            if ($details->video_url && Storage::disk('public')->exists($details->video_url)) {
                Storage::disk('public')->delete($details->video_url);
            }

            // 3. Delete the entire HLS folder, if the path exists.
            if ($details->hls_url) {
                // The hls_url is something like 'videos/hls/filename/master.m3u8'.
                // We just need the directory part: 'videos/hls/filename'.
                $hlsDirectory = dirname($details->hls_url);

                if (Storage::disk('public')->exists($hlsDirectory)) {
                    // deleteDirectory() will remove the folder and all its contents (playlists and video segments).
                    Storage::disk('public')->deleteDirectory($hlsDirectory);
                }
            }
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
