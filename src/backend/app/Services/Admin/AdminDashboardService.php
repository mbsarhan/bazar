<?php

namespace App\Services\Admin;

use App\Models\PendingAdvertisement;
use App\Models\User;
use App\Models\Advertisement;
use Illuminate\Support\Facades\DB; 
use Carbon\Carbon;      
use App\Models\DailyAdCount;  

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
        $pendingAds = PendingAdvertisement::count();

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
    public function getWeeklyAdsChartData()
    {
        // Set the locale to Arabic to get Arabic day names
        Carbon::setLocale('ar');
        // Step A: Get the pre-calculated counts from our new, fast summary table.
        $adCounts = DailyAdCount::where('date', '>=', now()->subDays(6)->toDateString())
            ->pluck('ad_count', 'date'); // Pluck into an associative array ['YYYY-MM-DD' => count]

        // Step B: Build the final chart data array, filling in any missing days with 0.
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dateString = $date->format('Y-m-d');
            
            $chartData[] = [
                'name' => $date->translatedFormat('l'),
                // If a count exists for this date, use it. Otherwise, use 0.
                'عدد الإعلانات' => $adCounts[$dateString] ?? 0,
            ];
        }

        return $chartData;
    }
}