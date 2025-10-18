<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRealestateAdRequest extends FormRequest
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
        // 'sometimes' means the rule only applies if the field is present in the request.
        return [
            'transaction_type'   => ['sometimes', 'required', Rule::in(['بيع', 'أجار', 'استثمار'])],
            'realestate_type'    => ['sometimes', 'required', 'string'],
            'governorate'        => ['sometimes', 'required', 'string'],
            'city'               => ['sometimes', 'required', 'string', 'max:255'],
            'detailed_address'   => ['sometimes', 'required', 'string', 'max:500'],
            'area'               => ['sometimes', 'required', 'numeric', 'min:1'],
            'bedroom_num'        => ['nullable', 'integer', 'min:0'],
            'bathroom_num'       => ['nullable', 'integer', 'min:0'],
            'floor_num'          => ['nullable', 'integer'],
            'building_status'    => ['sometimes', 'required', 'string'],
            'cladding_condition' => ['sometimes', 'required', 'string'],
            'price'              => ['sometimes', 'required', 'numeric', 'min:0'],
            'negotiable_check'   => ['sometimes', 'required', 'boolean'],
            'description'        => ['nullable', 'string', 'max:5000'],
            'images'             => 'nullable|array',
            'images.*'           => 'image|mimes:jpeg,png,jpg,webp|max:5120',
            'video'              => ['nullable', 'file', 'mimes:mp4,mov,avi,webm', 'max:20480'],
            'removed_media'      => 'nullable|array',
            'removed_media.*'    => 'string', // e.g., 'image_filename.jpg', 'video_filename.mp4'
        ];
    }
}
