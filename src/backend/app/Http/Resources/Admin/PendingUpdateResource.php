<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class PendingUpdateResource extends JsonResource
{
   /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
       // $this refers to the PendingAdvertisementUpdate model
        return [
            'id' => $this->id, // The ID of the pending update itself
            'advertisement_id' => $this->advertisement_id,
            'status' => $this->ad_status,
            'date_of_request' => Carbon::parse($this->created_at)->translatedFormat('Y-m-d H:i'),
            // --- Details of the ORIGINAL Ad ---
            'original_ad' => $this->whenLoaded('advertisement', [
                'title' => $this->advertisement->title,
                'status' => $this->advertisement->ad_status,
                'owner' => $this->advertisement->owner->fname . ' ' . $this->advertisement->owner->lname,
                'owner_id' => $this->advertisement->owner->id,
            ]),
            
            // From the 'advertisement' relationship
            'title' => $this->whenLoaded('advertisement', $this->advertisement->title),
            
            // From the 'advertisement.owner' nested relationship
            'user' => [
                'name' => $this->whenLoaded('advertisement', function() {
                    return $this->advertisement->owner->fname . ' ' . $this->advertisement->owner->lname;
                }),
            ],
            // --- The NEW data the user wants to save ---
            'pending_data' => [
                'title' => $this->title,
                'price' => $this->price,
                'location' => "{$this->governorate}, {$this->city}",
                'manufacturer' => $this->manufacturer,
                'model' => $this->model,
                'model_year' => $this->model_year,
                // Add any other pending fields you want to display...
                'description' => $this->description,
            ],

            // Determine ad type based on which details exist in the pending data
            'type' => isset($this->manufacturer) ? 'سيارة' : 'عقار',

            // Format the date for display
            'date' => Carbon::parse($this->created_at)->translatedFormat('Y-m-d'),

            // Pass along the media changes for the detail view
            'media_changes' => $this->pending_media,
        ];
    }
}
