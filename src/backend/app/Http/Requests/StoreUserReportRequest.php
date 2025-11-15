<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Get the user being reported from the route parameter.
        $reportedUser = $this->route('user');

        // A user cannot report themselves.
        return $this->user()->id !== $reportedUser->id;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'reason' => [
                'required',
                'string',
                // Ensure the reason is one of the valid options from your frontend.
                Rule::in(['spam', 'fraud', 'fake', 'harassment', 'inappropriate', 'other']),
            ],
            'description' => [
                'required',
                'string',
                'min:20', // Require a meaningful description
                'max:2000', // Prevent excessively long submissions
            ],
        ];
    }
}