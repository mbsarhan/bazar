<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rules\Password;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fname' => 'required|string|max:255',
            'lname' => 'required|string|max:255',

            // --- THIS IS THE UPDATED LOGIC ---
            // The email must be a valid email and unique, but it's only required if the phone field is not present.
            'email' => 'required_without:phone|nullable|string|email|max:255|unique:users',
            
            // The phone is only required if the email field is not present.
            'phone' => 'required_without:email|nullable|string|max:255',

            'password' => [
                'required',
                'string',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->numbers(),
            ],
        ];
    }
}