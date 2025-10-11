<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class ReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // $this refers to a UserRating model instance
        return [
            'id'           => $this->id,
            'rating'       => $this->rating,
            'comment'      => $this->message, // Map 'message' from DB to 'comment' for frontend
            // Format the date to be human-readable, e.g., "August 31, 2025"
            'date'         => Carbon::parse($this->created_at)->translatedFormat('j F Y'),
            // Get the full name of the person who wrote the review
            'reviewerName' => "{$this->rater->fname} {$this->rater->lname}",
        ];
    }
}
