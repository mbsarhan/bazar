<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdatePasswordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only authorized (logged-in) users can make this request.
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
            // The 'current_password' and 'different' rules are no longer needed here.
            'password' => [
                'required',
                'string',
                'confirmed', // Still checks for 'password_confirmation' field
                Password::min(8)
                    ->mixedCase()
                    ->numbers(),
            ],
        ];
    }
}