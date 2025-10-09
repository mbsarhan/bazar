<?php

namespace App\Services;

use App\Models\User;
use App\Models\Advertisement;

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
}