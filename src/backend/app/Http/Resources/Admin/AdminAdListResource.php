<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class AdminAdListResource extends JsonResource
{
    /**
     * Transform the resource into an array for the admin ad list.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // $this refers to the Advertisement model instance
        return [
            'id' => $this->id, // The ID of the advertisement itself
            'title' => $this->title,
            'user' => [
                'name' => $this->whenLoaded('owner', fn() => $this->owner->fname . ' ' . $this->owner->lname),
            ],
            // Determine type based on loaded relationships
            'type' => $this->relationLoaded('carDetails') && $this->carDetails ? 'سيارة' : 'عقار',
            // Format the creation date
            'date' => Carbon::parse($this->created_at)->translatedFormat('Y-m-d'),
            'status' => $this->ad_status, // Also return the status
        ];
    }
}