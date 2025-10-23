<?php

namespace App\Services\Admin;

use App\Models\User;
use App\Models\Advertisement;
use Illuminate\Support\Facades\DB; 
use Carbon\Carbon;                // <-- 2. IMPORT CARBON FOR DATE HANDLING

class AdminDashboardService
{
    /**
     * Gathers key statistics for the admin dashboard.
     *
     * @return array
     */
    public function getStatistics(): array
    {
        // 1. Get the total number of registered users.
        $totalUsers = User::count();

        // 2. Get the total number of advertisements.
        // --- 2. Get Detailed Car Ad Stats ---
        // This is a powerful query that counts all statuses in a single database trip.
        // 2. Get the ABSOLUTE total number of advertisements, regardless of status.
        $totalAds = Advertisement::count();

      // 3. Get the count of ONLY pending advertisements.
        $pendingAds = Advertisement::where('ad_status', 'قيد المراجعة')->count();

        // 4. Return the data in a structured array.
        return [
            'totalUsers' => $totalUsers,
        'totalAds'   => $totalAds,
        'pendingAds' => $pendingAds,
        ];
    }

    /**
     * --- 3. THIS IS THE NEW METHOD ---
     * Gathers the count of new ads for each of the last 7 days.
     * @return array
     */
    public function getWeeklyAdsChartData(): array
    {
        // Set the locale to Arabic to get Arabic day names
        Carbon::setLocale('ar');

        // Step A: Create an array representing the last 7 days, with initial counts of 0.
        $dateRange = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            // We use 'Y-m-d' as a key and get the translated day name.
            $dateRange[$date->format('Y-m-d')] = [
                'name' => $date->translatedFormat('l'), // 'l' gives the full day name (e.g., السبت)
                'عدد الإعلانات' => 0
            ];
        }

        // Step B: Query the database to get the actual counts for the days that have ads.
        $adCounts = Advertisement::where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get([
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as count')
            ])
            ->keyBy('date'); // Use keyBy() to make merging easier

        // Step C: Merge the database results into our template array.
        foreach ($adCounts as $date => $data) {
            if (isset($dateRange[$date])) {
                $dateRange[$date]['عدد الإعلانات'] = $data->count;
            }
        }

        // Step D: Return only the values of the array to get the final list format.
        return array_values($dateRange);
    }
}