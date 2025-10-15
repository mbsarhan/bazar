<?php

namespace App\Services;

use App\Models\Advertisement;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request; // <-- 1. IMPORT THE REQUEST CLASS

class AdvertisementService
{
    /**
     * Get a paginated list of public ads, with optional filtering.
     */
    public function getPublicListing(Request $request): LengthAwarePaginator // <-- 2. ACCEPT THE REQUEST
    {
        // Start building the query on the Advertisement model
        $query = Advertisement::query();

        // --- 3. THE NEW FILTERING LOGIC ---
        // Check if a 'type' parameter was passed in the URL (e.g., /api/advertisements?type=car)
        if ($request->has('type')) {
            $type = $request->query('type');

            if ($type === 'car') {
                // If type is 'car', only include ads that have a carDetails relationship.
                $query->whereHas('carDetails');
            } elseif ($type === 'real_estate') {
                // If type is 'real_estate', only include ads that have a realEstateDetails relationship.
                $query->whereHas('realEstateDetails');
            }
        }
        
        // These conditions are applied to all queries
        return $query->where('ad_status', 'فعال') // Always filter for active ads
            ->with([
                'owner:id,fname,lname',
                'carDetails.ImagesForCar',
                'realEstateDetails.ImageForRealestate'
            ])
            ->latest() // Always sort by newest first
            ->paginate(1000);
    }
}