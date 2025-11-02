<?php

namespace App\Services;

use App\Models\Advertisement;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdvertisementSearchService
{
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
        if (!empty($filters['q'])) {
            $this->applyKeywordSearch($query, $filters['q'], $type);
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
    private function applyOptionalFilters(Builder $query, array $filters)
    {
        // Common filters
        if (!empty($filters['min_price'])) {
            $query->where('advertisements.price', '>=', $filters['min_price']);
        }
        if (!empty($filters['max_price'])) {
            $query->where('advertisements.price', '<=', $filters['max_price']);
        }
        if (!empty($filters['governorate'])) {
            $query->where('advertisements.governorate', $filters['governorate']);
        }
        if (!empty($filters['city'])) {
            $query->where('advertisements.city', $filters['city']);
        }

        // Car-specific filters
        if ($filters['type'] === 'car') {
            if (!empty($filters['manufacturer'])) {
                $query->where('car_ads.manufacturer', $filters['manufacturer']);
            }
            if (!empty($filters['model_year_from'])) {
                $query->where('car_ads.model_year', '>=', $filters['model_year_from']);
            }
            if (!empty($filters['model_year_to'])) {
                $query->where('car_ads.model_year', '<=', $filters['model_year_to']);
            }
            if (!empty($filters['condition'])) {
                $query->where('car_ads.condition',$filters['condition']);
            }
            if (!empty($filters['gear'])) {
            $query->where('car_ads.gear', $filters['gear']);
            }
            if (!empty($filters['fule_type'])) {
            $query->where('car_ads.fule_type', $filters['fule_type']);
            }
            if (!empty($filters['min_distance_traveled'])) {
            $query->where('car_ads.distance_traveled', '>=', $filters['min_distance_traveled']);
            }
            if (!empty($filters['max_distance_traveled'])) {
            $query->where('car_ads.distance_traveled', '<=', $filters['max_distance_traveled']);
            }
            
        }
        
        // Real estate-specific filters
        if ($filters['type'] === 'real_estate') {
            // if (!empty($filters['transaction_type'])) {
            //     $query->where('advertisements.transaction_type', $filters['transaction_type']);
            // }
            if (!empty($filters['realestate_type'])) {
                $query->where('realestate_ads.realestate_type', $filters['realestate_type']);
            }
            if (!empty($filters['building_status'])) {
                $query->where('realestate_ads.building_status', $filters['building_status']);
            }

            if (!empty($filters['min_area'])) {
                $query->where('realestate_ads.area', '>=', $filters['min_area']);
            }

            if (!empty($filters['max_area'])) {
                $query->where('realestate_ads.area', '<=', $filters['max_area']);
            }

            if (!empty($filters['min_bedroom_num'])) {
                $query->where('realestate_ads.bedroom_num', '>=', $filters['min_bedroom_num']);
            }

            if (!empty($filters['max_bedroom_num'])) {
                $query->where('realestate_ads.bedroom_num', '<=', $filters['max_bedroom_num']);
            }

            if (!empty($filters['min_bathroom_num'])) {
                $query->where('realestate_ads.bathroom_num', '>=', $filters['min_bathroom_num']);
            }

            if (!empty($filters['max_bathroom_num'])) {
                $query->where('realestate_ads.bathroom_num', '<=', $filters['max_bathroom_num']);
            }

            if (!empty($filters['min_floor_num'])) {
                $query->where('realestate_ads.floor_num', '>=', $filters['min_floor_num']);
            }

            if (!empty($filters['max_floor_num'])) {
                $query->where('realestate_ads.floor_num', '<=', $filters['max_floor_num']);
            }
        }
    }
}