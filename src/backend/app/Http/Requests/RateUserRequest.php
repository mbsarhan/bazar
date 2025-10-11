<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class RateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'rated_user_id' => [
                'required',
                'integer',
                'exists:users,id', // The user being rated must exist.
                Rule::notIn([$this->user()->id]), // A user cannot rate themselves.
            ],
            'rating' => [
                'required',
                'integer',
                'between:1,5', // Rating must be from 1 to 5.
            ],
            'message' => [
                'nullable',
                'string',
                'max:500', // Optional message with a max length.
            ],
        ];
    }

     public function messages(): array
    {
        return [
            'rated_user_id.required' => 'You must specify which user you are rating.',
            'rated_user_id.exists' => 'The user you are trying to rate does not exist.',
            'rated_user_id.not_in' => 'You cannot rate yourself.',
            'rating.required' => 'A rating value is required.',
            'rating.between' => 'The rating must be between 1 and 5.',
        ];
    }
}
