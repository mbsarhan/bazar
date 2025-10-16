<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCarAdRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'transaction_type' => ['sometimes', 'required', Rule::in(['بيع', 'إيجار', 'استثمار'])],
            'manufacturer'      => 'sometimes|required|string|max:255',
            'model'             => 'sometimes|required|string|max:255',
            'model_year'        => 'sometimes|required|digits:4|integer|min:1900',
            'condition'            => ['sometimes', 'required', Rule::in(['جديدة', 'مستعملة', 'متضررة'])],
            'gear'              => ['sometimes', 'required', Rule::in(['عادي', 'أوتوماتيك', 'الإثنان معا'])],
            'fuel_type'         => ['sometimes', 'required', Rule::in(['بنزين', 'ديزل', 'كهرباء', 'هايبرد'])],
            'distance_traveled' => 'sometimes|required|numeric|min:0',
            'price'            => 'sometimes|required|numeric|min:0',
            'negotiable_check'  => 'sometimes|required|boolean',
            'governorate'      => 'sometimes|required|string|max:255',
            'city'             => 'sometimes|required|string|max:255',
            'description'      => 'nullable|string',
            'front'           => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'back'            => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'side1'           => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'side2'           => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'extra_images'    => 'nullable|array',
            'extra_images.*'  => 'image|mimes:jpeg,png,jpg,webp|max:5120',
            'removed_images'   => 'nullable|array',
            'removed_images.*' => 'string', // e.g., 'front', 'side2', 'extra_123.jpg'
        ];
    }
}
