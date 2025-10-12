<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class AdvertisementResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $baseUrl = config('app.url');

        $baseData = [
            'id' => $this->id,
            'price' => number_format($this->price) . ' ل.س',
            'location' => "{$this->governorate}, {$this->city}",
            'status' => $this->ad_status,
            'views' => $this->views_count,
            'isPublic' => true,
        ];

        // --- CAR AD LOGIC ---
        if ($this->relationLoaded('carDetails') && $this->carDetails) {
            $carImages = $this->carDetails->ImagesForCar;
            
            $carData = [
                'title' => $this->title,
                'model_year' => $this->carDetails->model_year,
                'distance_traveled' => $this->carDetails->distance_traveled,
                'gear' => $this->carDetails->gear,
                'fuel_type' => $this->carDetails->fuel_type,
                'condition' => $this->carDetails->condition,
                'governorate' => $this->governorate,
                'imageUrls' => $carImages->isNotEmpty()
                    ? $carImages->map(fn($image) => "{$baseUrl}/storage/{$image->image_url}")
                    : ['https://via.placeholder.com/300x200.png?text=No+Image'], // Fallback
                'propertyType' => null,
                'area' => null,
            ];
            return array_merge($baseData, $carData);
        }

        // --- REAL ESTATE AD LOGIC ---
        if ($this->relationLoaded('realEstateDetails') && $this->realEstateDetails) {
            $realEstateImages = $this->realEstateDetails->ImageForRealestate;

            $realEstateData = [
                'title' => $this->title,
                'realestate_type' => $this->realEstateDetails->realestate_type,
                'area' => $this->realEstateDetails->realestate_size,
                'imageUrls' => $realEstateImages->isNotEmpty()
                    ? $realEstateImages->map(fn($image) => "{$baseUrl}/storage/{$image->image_url}")
                    : ['https://via.placeholder.com/300x200.png?text=No+Image'], // Fallback
                'year' => null,
                'mileage' => null,
            ];
            return array_merge($baseData, $realEstateData);
        }

        // Fallback for an ad with no details
        return array_merge($baseData, ['title' => 'إعلان غير محدد', 'imageUrls' => ['https://via.placeholder.com/300x200.png?text=No+Image']]);
    }
}
