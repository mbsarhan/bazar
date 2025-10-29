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

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => ['nullable', 'string', Rule::in(['car', 'realestate'])],
            'q' => ['nullable', 'string', 'min:2', 'max:100'],

            // Common Optional Filters
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0', 'gte:min_price'],
            'governorate' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],

            // Car-Specific Optional Filters
            'manufacturer' => ['nullable', 'string', 'max:255'],
            'model_year_from' => ['nullable', 'integer', 'digits:4'],
            'model_year_to' => ['nullable', 'integer', 'digits:4', 'gte:model_year_from'],

            // Real Estate-Specific Optional Filters
            'transaction_type' => ['nullable', 'string', Rule::in(['بيع', 'أجار', 'استثمار'])],
            'realestate_type' => ['nullable', 'string', Rule::in(['شقة','فيلا','محل تجاري','مكتب','أرض','مزرعة','شاليه','مستودع','سوق تجاري'])],
        ];
    }
}
