<?php

namespace App\Services;

use App\Models\Advertisement;
use App\Services\Concerns\Filters;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request; // <-- 1. IMPORT THE REQUEST CLASS
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage; // <-- IMPORT

class AdvertisementService
{
    use Filters;
    /**
     * Get a paginated list of public ads, with optional filtering.
     */
    public function getPublicListing(Request $request): LengthAwarePaginator // <-- 2. ACCEPT THE REQUEST
    {
        if ($request->has('priceRange') && is_array($request->priceRange) && count($request->priceRange) === 2) {
            $request->merge([
                'min_price' => $request->priceRange[0],
                'max_price' => $request->priceRange[1],
            ]);
        }
        // Start building the query on the Advertisement model
        $query = Advertisement::query();

        if ($request->filled('geo_location')) {
        // Use an exact match '=' instead of 'LIKE' for better performance.
        $query->where('geo_location', $request->query('geo_location'));
    }

    // Filter 2: Apply the 'type' filter if it exists.
    if ($request->filled('type')) {
        $type = $request->query('type');
        if ($type === 'car') {
            $query->whereHas('carDetails');
            // $query->join('car_ads', 'advertisements.id', '=', 'car_ads.ads_id');
        } elseif ($type === 'real_estate') {
            $query->whereHas('realEstateDetails');
            // $query->join('realestate_ads', 'advertisements.id', '=', 'realestate_ads.ads_id');
        }
    }

    $this->applyOptionalFilters($query, $request->all());

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
            ->paginate(24); // It's better to use a smaller page size like 20
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






    /**
     * Permanently delete an advertisement and all its associated media as an admin.
     */
    public function deleteAdAsAdmin(Advertisement $ad): bool
    {
        return DB::transaction(function () use ($ad) {
            $owner = $ad->owner;

            // 1. Eager-load all nested relationships needed for file cleanup.
            $ad->load(['carDetails.ImagesForCar', 'realEstateDetails.ImageForRealestate']);

            // 2. Delete Car Ad Images if they exist
            if ($ad->carDetails && $ad->carDetails->ImagesForCar) {
                foreach ($ad->carDetails->ImagesForCar as $image) {
                    Storage::disk('public')->delete($image->image_url);
                }
            }

            // 3. Delete Real Estate Ad Images and Videos if they exist
            if ($ad->realEstateDetails) {
                // Delete images
                foreach ($ad->realEstateDetails->ImageForRealestate as $image) {
                    Storage::disk('public')->delete($image->image_url);
                }
                // Delete video files (originals and HLS folders)
                if ($ad->realEstateDetails->video_url) {
                    Storage::disk('public')->delete($ad->realEstateDetails->video_url);
                }
                if ($ad->realEstateDetails->hls_url) {
                    $hlsDirectory = dirname($ad->realEstateDetails->hls_url);
                    Storage::disk('public')->deleteDirectory($hlsDirectory);
                }
            }
            
            // 4. Delete the advertisement record from the database.
            // All related records in other tables will be cascade deleted by the database.
            $deleted = $ad->delete();

            // 5. Decrement the owner's ad counter.
            if ($deleted && $owner) {
                $owner->decrement('ads_num');
            }

            return $deleted;
        });
    }
}