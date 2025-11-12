<?php
namespace App\Services\Concerns;
use Illuminate\Database\Eloquent\Builder;
trait Filters
{
    /**
     * Applies all optional filters from the request data to the query.
     *
     * @param Builder $query The Eloquent query builder instance.
     * @param array $filters The array of validated request filters.
     * @return void
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
            if (!empty($filters['fuel_type'])) {
            $query->where('car_ads.fuel_type', $filters['fuel_type']);
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