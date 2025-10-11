<?php

namespace App\Services;

use App\Models\Advertisement;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdvertisementService
{
    /**
     * Get a paginated list of all public, active advertisements.
     */
    public function getPublicListing(): LengthAwarePaginator
    {
        return Advertisement::where('ad_status', 'فعال') // Only fetch 'active' ads
            // Eager-load all possible relationships needed by the resource
            ->with([
                'owner:id,fname,lname', // Only get the ID and name of the owner
                'carDetails.ImagesForCar',
                'realEstateDetails.ImageForRealestate'
            ])
            ->latest() // Order by created_at descending
            ->paginate(perPage: 100000); // Paginate the results, 12 ads per page
    }
}