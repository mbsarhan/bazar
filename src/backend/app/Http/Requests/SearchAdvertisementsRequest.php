<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SearchAdvertisementsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
    /*
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    protected function prepareForValidation(): void
    {
        // Check if the frontend sent a 'priceRange' array
        if ($this->has('priceRange') && is_array($this->priceRange) && count($this->priceRange) === 2) {
            // If it exists, merge new keys into the request data.
            // This transforms 'priceRange' => [500, 50000]
            // into 'min_price' => 500 and 'max_price' => 50000
            $this->merge([
                'min_price' => $this->priceRange[0],
                'max_price' => $this->priceRange[1],
            ]);
        }
        
        // You can add similar logic for other range filters here
        // For example, if the frontend sends 'areaRange': [100, 500]
        if ($this->has('areaRange') && is_array($this->areaRange) && count($this->areaRange) === 2) {
            $this->merge([
                'min_area' => $this->areaRange[0],
                'max_area' => $this->areaRange[1],
            ]);
        }
    }
    public function rules(): array
    {
        return [
            'type' => ['required', 'string', Rule::in(['car', 'real_estate'])],
            'query' => ['required', 'string', 'min:2', 'max:100'],

            // Common Optional Filters
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0', 'gte:min_price'],
            'governorate' => ['nullable', 'string', 'max:255'], 
            'city' => ['nullable', 'string', 'max:255'],

            // Car-Specific Optional Filters
            'manufacturer' => ['nullable', 'string', 'max:255'],
            'model_year_from' => ['nullable', 'integer', 'digits:4'],
            'model_year_to' => ['nullable', 'integer', 'digits:4', 'gte:model_year_from'],
            'condition' => ['nullable','string',Rule::in(['new','used','متضررة'])],
            'gear' => ['nullable','string',Rule::in(['عادي','أوتوماتيك','الإثنان معا'])],
            'fule_type'=> ['nullable','string',Rule::in(['بنزين','ديزل','كهرباء','هايبرد'])],
            'min_distance_traveled' => ['nullable', 'numeric', 'min:0'],
            'max_distance_traveled' => ['nullable', 'numeric', 'min:0', 'gte:min_distance_traveled'],

            // Real Estate-Specific Optional Filters
            // 'transaction_type' => ['nullable', 'string', Rule::in(['بيع', 'أجار', 'استثمار'])],
            'realestate_type' => ['nullable', 'string', Rule::in(['شقة','فيلا','محل تجاري','مكتب','أرض','مزرعة','شاليه','مستودع','سوق تجاري'])],
            'building_status' => ['nullable','string',Rule::in(['جاهز','على الهيكل','قيد الانشاء'])],
            'min_area' => ['nullable', 'numeric', 'min:0'],
            'max_area' => ['nullable', 'numeric', 'min:0', 'gte:min_area'],
            'min_bedroom_num' => ['nullable', 'numeric', 'min:0'],
            'max_bedroom_num' => ['nullable', 'numeric', 'min:0', 'gte:min_bedroom_num'],
            'min_bathroom_num' => ['nullable', 'numeric', 'min:0'],
            'max_bathroom_num' => ['nullable', 'numeric', 'min:0', 'gte:min_bathroom_num'],
            'min_floor_num' => ['nullable', 'numeric', 'min:0'],
            'max_floor_num' => ['nullable', 'numeric', 'min:0', 'gte:min_floor_num'],
        ];
    }
}
