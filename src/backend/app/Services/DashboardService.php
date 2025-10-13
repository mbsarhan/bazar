<?php

namespace App\Services;

use App\Models\User;
use App\Models\Advertisement;
use Illuminate\Support\Facades\DB; // <-- IMPORT
use Carbon\Carbon; // <-- IMPORT
class DashboardService
{
    /**
     * Get aggregated ad statistics for a specific user.
     */
    public function getStatistics(User $user): array
    {
        // --- Car Ad Statistics ---
        $carStats = [
            'active'  => $this->getCountForStatus($user, 'فعال', 'carDetails'),
            'pending' => $this->getCountForStatus($user, 'قيد المراجعة', 'carDetails'),
            'sold'    => $this->getCountForStatus($user, 'مباع', 'carDetails')+$this->getCountForStatus($user, 'مؤجر', 'carDetails'),
        ];

        // --- Real Estate Ad Statistics ---
        $realEstateStats = [
            'active'  => $this->getCountForStatus($user, 'فعال', 'realEstateDetails'),
            'pending' => $this->getCountForStatus($user, 'قيد المراجعة', 'realEstateDetails'),
            'sold'    => $this->getCountForStatus($user, 'مباع', 'realEstateDetails')+$this->getCountForStatus($user, 'مؤجر', 'realEstateDetails'),
        ];

        return [
            'carStats'        => $carStats,
            'realEstateStats' => $realEstateStats,
        ];
    }

    /**
     * Helper function to perform an efficient count query.
     *
     * @param User $user The user model.
     * @param string $status The ad_status to count.
     * @param string $relation The relationship to check ('carDetails' or 'realEstateDetails').
     * @return int The count of ads.
     */
    private function getCountForStatus(User $user, string $status, string $relation): int
    {
        return Advertisement::where('owner_id', $user->id)
            ->where('ad_status', $status)
            ->whereHas($relation) // Ensures we only count ads of the correct type
            ->count();
    }


    /**
     * Get time-series view data for the user's ads.
     */
    public function getViewsData(User $user, string $range): array
    {
        // First, get all advertisement IDs owned by the user.
        $userAdIds = Advertisement::where('owner_id', $user->id)->pluck('id');

        if ($range === 'weeks') {
            return $this->getWeeklyViews($userAdIds);
        }

        // Default to 'days'
        return $this->getDailyViews($userAdIds);
    }



    private function getDailyViews($adIds): array
    {
        $endDate = Carbon::today();
        $startDate = Carbon::today()->subDays(6);

        $views = DB::table('ad_views')
            ->whereIn('advertisement_id', $adIds)
            ->whereBetween('date', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get([
                DB::raw('DATE(date) as date'),
                DB::raw('SUM(views) as total_views')
            ])
            ->keyBy('date'); // Key the collection by date for easy lookup

        $results = [];
        // Loop through the last 7 days to ensure we have a value for each day
        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i)->toDateString();
            // If views exist for this date, add them, otherwise add 0
            $results[] = $views->get($date)->total_views ?? 0;
        }

        return $results;
    }



    /**
     * Get view data grouped into rolling 7-day windows to match the frontend logic.
     * This is the corrected version.
     */
    private function getWeeklyViews($adIds): array
    {
        // We need data from the last 7 * 7 = 49 days to calculate 7 rolling weeks.
        $startDate = Carbon::today()->subDays(48);
        $endDate = Carbon::today();

        // This query is more complex. It uses a CASE statement to assign each date
        // to a specific "week bucket" based on how many days ago it was.
        $views = DB::table('ad_views')
            ->whereIn('advertisement_id', $adIds)
            ->whereBetween('date', [$startDate, $endDate])
            ->select(
                DB::raw('SUM(views) as total_views'),
                DB::raw("CASE
                    WHEN date >= CURDATE() - INTERVAL 6 DAY THEN 0 -- Current week (index 0)
                    WHEN date >= CURDATE() - INTERVAL 13 DAY THEN 1 -- Last week (index 1)
                    WHEN date >= CURDATE() - INTERVAL 20 DAY THEN 2
                    WHEN date >= CURDATE() - INTERVAL 27 DAY THEN 3
                    WHEN date >= CURDATE() - INTERVAL 34 DAY THEN 4
                    WHEN date >= CURDATE() - INTERVAL 41 DAY THEN 5
                    WHEN date >= CURDATE() - INTERVAL 48 DAY THEN 6
                    ELSE 7 -- Should not happen with our whereBetween
                END as week_bucket")
            )
            ->groupBy('week_bucket')
            ->get()
            ->keyBy('week_bucket'); // Key the results by our custom bucket index

        $results = [];
        // Loop from bucket 6 (oldest) to bucket 0 (newest) to build the final array
        for ($i = 6; $i >= 0; $i--) {
            // If views exist for that bucket, add them, otherwise add 0
            $results[] = (int) ($views->get($i)->total_views ?? 0);
        }
        
        // The array is built from oldest to newest, which matches the frontend labels.
        return $results;
    }

    
}