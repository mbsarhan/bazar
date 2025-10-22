<?php

namespace App\Services\Admin;

use App\Models\User;
use App\Models\Advertisement;

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
        $totalAds = Advertisement::count();

        // 3. Get the number of ads with the specific 'pending' status.
        // Make sure the string here exactly matches what you save in the database.
        $pendingAds = Advertisement::where('ad_status', 'قيد المراجعة')->count();

        // 4. Return the data in a structured array.
        return [
            'totalUsers' => $totalUsers,
            'totalAds' => $totalAds,
            'pendingAds' => $pendingAds,
        ];
    }
}