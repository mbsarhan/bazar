<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadVideoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // $advertisement = $this->route('advertisement');
        // return $this->user() && $this->user()->id === $advertisement->owner_id;
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
                'file',
                'mimes:mp4,mov,avi,wmv,webm',
                'max:20480', // 20 MB
        ];
    }
}
