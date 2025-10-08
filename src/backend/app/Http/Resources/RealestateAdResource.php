<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class RealestateAdResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $baseUrl = 'http://127.0.0.1:8000';

        return [
            'id' => $this->id,
            'price' => number_format($this->price) . ' ل.س',
            'location' => "{$this->governorate}, {$this->city}",
            'status' => $this->ad_status,
            'views' => $this->views_count,
            'description' => $this->description,
            'title'=> $this->title,
            'propertyType' => $this->realEstateDetails->realestate_type,
            'area' => $this->realEstateDetails->realestate_size,
            'bedrooms' =>$this->realEstateDetails->bedroom_num,
            'owner' => [
                'name' => "{$this->owner->fname} {$this->owner->lname}",
                'phone' => "{$this->owner->phone}",
            ],
            
            'imageUrls' => $this->whenLoaded('realEstateDetails', function () use ($baseUrl) {
                return $this->realEstateDetails->ImageForRealestate->map(fn($image) => "{$baseUrl}/storage/{$image->image_url}");
            }),
            'videoUrl' => $this->whenLoaded('realEstateDetails', function () use ($baseUrl) {
                return $this->realEstateDetails->video_url ? "{$baseUrl}/storage/{$this->realEstateDetails->video_url}" : null;
            }),
        ];
    }
}