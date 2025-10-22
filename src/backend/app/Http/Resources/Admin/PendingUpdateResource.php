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
            
            // From the 'advertisement' relationship
            'title' => $this->whenLoaded('advertisement', $this->advertisement->title),
            
            // From the 'advertisement.owner' nested relationship
            'user' => [
                'name' => $this->whenLoaded('advertisement', function() {
                    return $this->advertisement->owner->fname . ' ' . $this->advertisement->owner->lname;
                }),
            ],

            // Determine ad type based on which details exist in the pending data
            'type' => isset($this->manufacturer) ? 'سيارة' : 'عقار',

            // Format the date for display
            'date' => Carbon::parse($this->created_at)->translatedFormat('Y-m-d'),
        ];
    }
}
