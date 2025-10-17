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
        // Get the real estate details, which are already loaded
        // $details = $this->whenLoaded('realEstateDetails');

        // $videoUrl = null;
        // if ($details) {
        //     // Priority 1: Use the HLS URL if it's ready.
        //     if ($details->hls_url) {
        //         $videoUrl = Storage::url($this->$details->hls_url);
        //     } 
        //     // Priority 2: Fall back to the original video URL if HLS isn't ready.
        //     elseif ($this->$details->video_url) {
        //         $videoUrl = Storage::url($this->$details->video_url);
        //     }
        // }

        $baseUrl = config('app.url');

        $baseData = [
            'id'                => $this->id,
            'title'             => $this->title,
            'price'             => number_format($this->price),
            'location'          => "{$this->governorate}, {$this->city}",
            'description'       => $this->description,
            'status'            => $this->ad_status,
            'views'             => $this->views_count,
            'isPublic'          => true,
            'owner'             => [
                'name'          => "{$this->owner->fname} {$this->owner->lname}",
                'phone'         => "{$this->owner->phone}",
                'id'            => $this->owner->id,
                // You can add more owner details here if needed later, like phone number
            ],
        ];

        // --- CAR AD LOGIC ---
        if ($this->relationLoaded('carDetails') && $this->carDetails) {
            $carImages = $this->carDetails->ImagesForCar;
            
            $carData = [
                'manufacturer'      => $this->carDetails->manufacturer,
                'model'             => $this->carDetails->model,
                'model_year'        => $this->carDetails->model_year,
                'governorate'       => $this->governorate,
                'city'              => $this->city,
                'transaction_type'  => $this->carDetails->transaction_type,
                'distance_traveled' => number_format($this->carDetails->distance_traveled),
                'negotiable_check'  => $this->carDetails->negotiable_check,
                'gear'              => $this->carDetails->gear,
                'fuel_type'         => $this->carDetails->fuel_type,
                'condition'         => $this->carDetails->condition,

                // --- 2. ADD THE OWNER (SELLER) INFORMATION ---
                // The 'owner' relationship was already eager-loaded in the controller.


                // --- THE CORRECTED IMAGE URL GENERATION ---
                'imageUrls'         => $this->whenLoaded('carDetails', function () use ($baseUrl) {
                    return $this->carDetails->ImagesForCar->map(function ($image) use ($baseUrl) {
                        // Manually construct the full, absolute URL.
                        // $image->image_url is 'images/cars/your-file.jpg'
                        return "{$baseUrl}/storage/{$image->image_url}";
                    });
                }),
            ];
            return array_merge($baseData, $carData);
        }

        // --- REAL ESTATE AD LOGIC ---
        if ($this->relationLoaded('realEstateDetails') && $this->realEstateDetails) {
            $realEstateImages = $this->realEstateDetails->ImageForRealestate;
            $videoUrl = null;
            if ($this->realEstateDetails->hls_url) {
                $videoUrl = "{$baseUrl}/storage/{$this->realEstateDetails->hls_url}";
            } 
            // Priority 2: Fall back to the original video URL if HLS isn't ready.
            elseif ($this->realEstateDetails->video_url) {
                $videoUrl = "{$baseUrl}/storage/{$this->realEstateDetails->video_url}";
            }
            $realEstateData = [
                'governorate'           => $this->governorate,
                'city'                  => $this->city,
                'transaction_type'      => $this->transaction_type,
                'realestate_type'       => $this->realEstateDetails->realestate_type,
                'detailed_address'      => $this->realEstateDetails->detailed_address,
                'area'                  => number_format($this->realEstateDetails->area),
                'bedroom_num'           => $this->realEstateDetails->bedroom_num? $this->realEstateDetails->bedroom_num : 0,
                'bathroom_num'          => $this->realEstateDetails->bathroom_num? $this->realEstateDetails->bathroom_num : 0,
                'floor_num'             => $this->realEstateDetails->floor_num? $this->realEstateDetails->bathroom_num : 0,
                'building_status'       => $this->realEstateDetails->building_status,
                'cladding_condition'    => $this->realEstateDetails->cladding_condition,
                'negotiable_check'      => $this->realEstateDetails->negotiable_check,
                
                'imageUrls' => $this->whenLoaded('realEstateDetails', function () use ($baseUrl) {
                    return $this->realEstateDetails->ImageForRealestate->map(fn($image) => "{$baseUrl}/storage/{$image->image_url}");
                }),
                'videoUrl' => $videoUrl,
            ];
            return array_merge($baseData, $realEstateData);
        }

        // Fallback for an ad with no details
        return array_merge($baseData, ['title' => 'إعلان غير محدد', 'imageUrls' => ['https://via.placeholder.com/300x200.png?text=No+Image']]);
    }
}
