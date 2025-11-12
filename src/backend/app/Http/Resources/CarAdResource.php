<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CarAdResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // --- THIS IS THE CRITICAL FIX ---
        // We define the correct base URL for our API server here.
        // This completely bypasses any issues with APP_URL in the .env file.
        $baseUrl = 'http://127.0.0.1:8000';

        // $this refers to the Advertisement model.
        // We use the whenLoaded() helper to ensure we don't cause N+1 problems.
        $carDetails = $this->whenLoaded('carDetails');
        // The '$this' variable refers to the Advertisement model instance.
        // We can access its relationships that we eager-loaded.
        return [
            'id'                => $this->id,
            // Combining fields to create the 'title' as requested
            'title'             => "{$this->carDetails->manufacturer}  {$this->carDetails->model}  {$this->carDetails->model_year}",
            'manufacturer'      => $this->carDetails->manufacturer,
            'model'             => $this->carDetails->model,
            'model_year'        => $this->carDetails->model_year,
            // Formatting the price with a currency symbol
            'price'             => number_format($this->price),
            // Combining governorate and city for the 'location'
            'location'          => "{$this->governorate}, {$this->city}",
            'governorate'       => $this->governorate,
            'city'              => $this->city,
            'transaction_type'  => $this->carDetails->transaction_type,
            'status'            => $this->ad_status,
            'views'             => $this->views_count,
            'distance_traveled' => number_format($this->carDetails->distance_traveled),
            'negotiable_check'  => $this->carDetails->negotiable_check,
            'gear'              => $this->carDetails->gear,
            'fuel_type'         => $this->carDetails->fuel_type,
            'condition'         => $this->carDetails->condition,
            // --- 1. ADD THE DESCRIPTION FIELD ---
            'description'       => $this->description,

            // --- 2. ADD THE OWNER (SELLER) INFORMATION ---
            // The 'owner' relationship was already eager-loaded in the controller.
            'owner'             => [
                'name' => "{$this->owner->fname} {$this->owner->lname}",
                'phone' => "{$this->owner->phone}",
                // You can add more owner details here if needed later, like phone number
            ],


            // --- THE CORRECTED IMAGE URL GENERATION ---
            'imageUrls'         => $this->whenLoaded('carDetails', function () use ($baseUrl) {
                return $this->carDetails->ImagesForCar->map(function ($image) use ($baseUrl) {
                    // Manually construct the full, absolute URL.
                    // $image->image_url is 'images/cars/your-file.jpg'
                    return "{$baseUrl}/storage/{$image->image_url}";
                });
            }),
            
        ];
    }
}