<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // $this refers to a User model instance
        return [
            'id' => $this->id,
            // Your frontend expects 'name', so we'll construct it
            'name' => $this->fname . ' ' . $this->lname, 
            'email' => $this->email,
            'phone' => $this->phone,
            // 'withCount' automatically creates a property named '{relation}_count'
            'ads_count' => $this->advertisements_count, 
        ];
    }
}
