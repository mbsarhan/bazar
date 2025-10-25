<?php

namespace App\Services;

use App\Models\Advertisement;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request; // <-- 1. IMPORT THE REQUEST CLASS
use Illuminate\Support\Facades\DB;

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
        // if ($request->has('type')) {
        //     $type = $request->query('type');

        //     if ($type === 'car') {
        //         // If type is 'car', only include ads that have a carDetails relationship.
        //         $query->whereHas('carDetails');
        //     } elseif ($type === 'real_estate') {
        //         // If type is 'real_estate', only include ads that have a realEstateDetails relationship.
        //         $query->whereHas('realEstateDetails');
        //     }
        // }

        if ($request->filled('geo_location')) {
        // Use an exact match '=' instead of 'LIKE' for better performance.
        $query->where('geo_location', $request->query('geo_location'));
    }

    // Filter 2: Apply the 'type' filter if it exists.
    if ($request->filled('type')) {
        $type = $request->query('type');
        if ($type === 'car') {
            $query->whereHas('carDetails');
        } elseif ($type === 'real_estate') {
            $query->whereHas('realEstateDetails');
        }
    }

        // Always filter for active ads
        $query->where('ad_status', 'فعال');

        // --- NEW SORTING LOGIC ---
        $sortBy = $request->query('sort_by', 'newest-first'); // Default to 'newest-first' if not provided

            switch ($sortBy) {
                case 'oldest-first':
                    $query->oldest(); // Sorts by created_at ascending
                    break;
            case 'price-asc':
                // This raw expression tells the database:
                // "First, sort all ads with a price of 0 to the bottom (CASE ... 1),
                // and then sort the rest by their price in ascending order."
                $query->orderByRaw('CASE WHEN price = 0 THEN 1 ELSE 0 END, price ASC');
                break;
            case 'price-desc':
                // Similarly, here we push the zero-price ads to the bottom,
                // and then sort the rest by their price in descending order.
                $query->orderByRaw('CASE WHEN price = 0 THEN 1 ELSE 0 END, price DESC');
                break;
                case 'newest-first':
                default:
                    $query->latest(); // Sorts by created_at descending
                    break;
        }
        
        // --- FINAL QUERY EXECUTION (remains the same) ---
        return $query->with([
                'owner:id,fname,lname',
                'carDetails.ImagesForCar',
                'realEstateDetails.ImageForRealestate'
            ])
            ->paginate(100); // It's better to use a smaller page size like 20
    }



    /**
     * Get a paginated list of all advertisements for the admin panel, with filtering.
     */
    public function getAdminListing(Request $request): LengthAwarePaginator
    {
        $query = Advertisement::query();

        // Check for the 'status' query parameter
        if ($request->has('status') && $request->query('status') !== 'all') {
            $query->where('ad_status', $request->query('status'));
        }

        // Eager-load relationships needed by the AdminAdListResource
        return $query->with(['owner:id,fname,lname', 'carDetails', 'realEstateDetails'])
            ->latest()
            ->paginate(15);
    }
}