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
            'id'                => $this->id,
            'price'             => number_format($this->price),
            'location'          => "{$this->governorate}, {$this->city}",
            'governorate'       => $this->governorate,
            'city'              => $this->city,
            'status'            => $this->ad_status,
            'views'             => $this->views_count,
            'description'       => $this->description,
            'title'             => $this->title,
            'transaction_type'  => $this->transaction_type,
            'realestate_type'   => $this->realEstateDetails->realestate_type,
            'detailed_address'  => $this->realEstateDetails->detailed_address,
            'area'              => $this->realEstateDetails->area,
            'bedroom_num'       => $this->realEstateDetails->bedroom_num? $this->realEstateDetails->bedroom_num : 0,
            'bathroom_num'      => $this->realEstateDetails->bathroom_num? $this->realEstateDetails->bathroom_num : 0,
            'floor_num'         => $this->realEstateDetails->floor_num? $this->realEstateDetails->bathroom_num : 0,
            'building_status'   => $this->realEstateDetails->building_status,
            'cladding_condition'=> $this->realEstateDetails->cladding_condition,
            'negotiable_check'  => $this->realEstateDetails->negotiable_check,
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