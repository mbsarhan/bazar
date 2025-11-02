<?php

namespace App\Services;

use App\Models\Advertisement;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Services\Concerns\Filters;

class AdvertisementSearchService
{
    use Filters;
    /**
     * Performs a search for advertisements based on a set of filters.
     *
     * @param array $filters The validated search filters from the request.
     * @return LengthAwarePaginator
     */
    public function search(array $filters): array
    {
        // We define which nested relationship to load based on the search type.
        $relationsToLoad = [
            'owner:id,fname,lname', // Always load the owner
        ];

        $type = $filters['type'] ?? null;
        if (!$type) {
            // Or throw an exception, but returning empty is safe.
            return ['data' => [], 'meta' => []]; 
        }

        if ($filters['type'] === 'car') {

            // Load carDetails, and from there, load its ImagesForCar
            $relationsToLoad[] = 'carDetails.ImagesForCar'; 

        } elseif ($filters['type'] === 'real_estate') {

            // Load realEstateDetails, and from there, load its ImageForRealestate
            $relationsToLoad[] = 'realEstateDetails.ImageForRealestate';
        }
        
        // Start with the base Advertisement query and eager load the correct relationships
        $query = Advertisement::query()->with($relationsToLoad);

        $query->where('ad_status', 'فعال');

        // Join the relevant details table based on the 'type' filter
        if ($filters['type'] === 'car') {
            $query->join('car_ads', 'advertisements.id', '=', 'car_ads.ads_id');

        } elseif ($filters['type'] === 'real_estate') {
            $query->join('realestate_ads', 'advertisements.id', '=', 'realestate_ads.ads_id');
        }

        // Apply the primary keyword search ('q')
                // Only apply keyword search if 'q' is present and not empty
        if (!empty($filters['query'])) {
            $this->applyKeywordSearch($query, $filters['query'], $type);
        }
        
        // Apply all other optional filters
        $this->applyOptionalFilters($query, $filters);
        
        // Step 1: Execute the pagination query and get the paginator object.
        $paginator = $query->select('advertisements.*')
                           ->latest()
                           ->paginate(24)
                           ->withQueryString();
                           
        // Ensure we only select columns from the main 'advertisements' table to avoid conflicts,
        // order by the latest ads, and paginate the results.
        return [
            'data' => $paginator->items(), // The actual array of results
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total_results' => $paginator->total(),
            ]
        ];
    }

    /**
     * Applies the main keyword search logic.
     */
    private function applyKeywordSearch(Builder $query, string $keyword, string $type): void
    {
        $query->where(function (Builder $qBuilder) use ($keyword, $type) {
            // Search in common fields for both types
            $qBuilder->where('advertisements.title', 'LIKE', "%{$keyword}%")
                    ->orWhere('advertisements.description', 'LIKE', "%{$keyword}%")
                    ->orWhere('advertisements.city', 'LIKE', "%{$keyword}%")
                    ->orWhere('advertisements.governorate', 'LIKE', "%{$keyword}%");

            // Add type-specific fields to the keyword search
            if ($type === 'car') {
                $qBuilder->orWhere('car_ads.manufacturer', 'LIKE', "%{$keyword}%")
                         ->orWhere('car_ads.model', 'LIKE', "%{$keyword}%");
            } elseif ($type === 'real_estate') {
                $qBuilder->orWhere('realestate_ads.detailed_address', 'LIKE', "%{$keyword}%");
            }
        });
    }

    /**
     * Applies various optional filters to the query.
     */
}