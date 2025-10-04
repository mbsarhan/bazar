<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCarAdRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Only authenticated users will reach this via the route middleware.
    }

    public function rules(): array
    {
        return [
            // --- Advertisement Table Fields ---
            'transaction_type' => ['required', Rule::in(['بيع', 'إيجار', 'استثمار'])],
            'price'            => 'required|numeric|min:0',
            'governorate'      => 'required|string|max:255',
            'city'             => 'required|string|max:255',
            'description'      => 'nullable|string',

            // --- CarAds Table Fields ---
            'manufacturer'      => 'required|string|max:255',
            'model'             => 'required|string|max:255',
            'model_year'        => 'required|digits:4|integer|min:1900',
            'distance_traveled' => 'required|numeric|min:0',
            'status'            => ['required', Rule::in(['جديدة', 'مستعملة', 'متضررة'])],
            'gear'              => ['required', Rule::in(['عادي', 'أوتوماتيك', 'الإثنان معا'])],
            'fule_type'         => ['required', Rule::in(['بانزين', 'ديزل', 'كهرباء', 'هايبرد'])],
            'negotiable_check'  => 'required|boolean',

            // --- Image Uploads ---
            'front'           => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
            'back'            => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'side1'           => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'side2'           => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'extra_images'    => 'nullable|array',
            'extra_images.*'  => 'image|mimes:jpeg,png,jpg,gif|max:2048', // Validate each file in the array
        ];
    }
}