<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class StoreRealestateAdRequest extends FormRequest
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
            'title'            => ['required', 'string', 'max:255'],
            'price'            => ['required', 'numeric', 'min:0'],
            'description'      => ['nullable', 'string', 'max:1000'],
            'transaction_type' => ['required', 'string', Rule::in(['بيع', 'أجار', 'استثمار'])],
            'ad_status'        => ['required', 'string', Rule::in(['فعال', 'قيد المراجعة', 'مباع', 'مؤجر'])], 
            'governorate'      => ['required', 'string', Rule::in('القامشلي','درعا','السويداء','ريف دمشق','دمشق','حمص','حماة','اللاذقية','طرطوس','حلب','إدلب','دير الزور','الرقة','الحسكة')],
            'city'             => ['required', 'string', 'max:255'],
            // 'currency_type'    => ['required', 'string', Rule::in(['SYP', 'USD', 'EUR'])], 
            // 'views_count' will be set by the system, not directly by user input

            // Real Estate Specific Fields
            'realestate_type'    => ['required', 'string'], 
            'detailed_address'   => ['required', 'string', 'max:500'], 
            'realestate_size'    => ['required', 'numeric', 'min:1'], 
            'bedroom_num'        => ['nullable', 'integer', 'min:0'], 
            'bathroom_num'       => ['nullable', 'integer', 'min:0'], 
            'floor_num'          => ['nullable', 'integer'],
            'building_status'    => ['required', 'string', Rule::in(['جاهز', 'على الهيكل', 'قيد الإنشاء'])], 
            'cladding_condition' => ['required', 'string'], 
            'negotiable_check'   => ['required', 'boolean'], 

            // Media Uploads
            'front'           => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
            'back'            => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'side1'           => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'side2'           => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'extra_images'    => 'nullable|array',
            'extra_images.*'  => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'video'            => ['required', 'file', 'mimes:mp4,mov,avi,wmv', 'max:20480'], // Single video, max 20MB
        ];
    }



    public function messages(): array
    {
        return [
            // Advertisement Base Fields Messages
            'title.required'             => 'عنوان الإعلان مطلوب.',
            'price.required'             => 'السعر مطلوب.',
            'price.numeric'              => 'يجب أن يكون السعر رقماً.',
            'price.min'                  => 'يجب أن يكون السعر أكبر من أو يساوي صفر.',
            'description.max'            => 'يجب ألا يتجاوز الوصف 1000 حرف.',
            'transaction_type.required'  => 'نوع المعاملة مطلوب (بيع، إيجار، تبادل).',
            'transaction_type.in'        => 'نوع المعاملة غير صالح.',
            'ad_status.required'         => 'حالة الإعلان مطلوبة.',
            'ad_status.in'               => 'حالة الإعلان غير صالحة.',
            'governorate.required'       => 'المحافظة مطلوبة.',
            'city.required'              => 'المدينة مطلوبة.',
            'currency_type.required'     => 'نوع العملة مطلوب.',
            'currency_type.in'           => 'نوع العملة غير صالح.',

            // Real Estate Specific Fields Messages
            'realestate_type.required'   => 'نوع العقار مطلوب.',
            'realestate_type.in'         => 'نوع العقار غير صالح.',
            'detailed_address.required'  => 'العنوان المفصل مطلوب.',
            'detailed_address.max'       => 'يجب ألا يتجاوز العنوان 500 حرف.',
            'realestate_size.required'   => 'مساحة العقار مطلوبة.',
            'realestate_size.numeric'    => 'يجب أن تكون مساحة العقار رقماً.',
            'realestate_size.min'        => 'يجب أن تكون مساحة العقار أكبر من أو يساوي 1.',
            'bedroom_num.integer'        => 'يجب أن يكون عدد غرف النوم رقماً صحيحاً.',
            'bathroom_num.integer'       => 'يجب أن يكون عدد الحمامات رقماً صحيحاً.',
            'floor_num.integer'          => 'يجب أن يكون رقم الطابق رقماً صحيحاً.',
            'building_status.required'   => 'حالة البناء مطلوبة.',
            'building_status.in'         => 'حالة البناء غير صالحة.',
            'cladding_condition.required' => 'حالة الكسوة مطلوبة.',
            'cladding_condition.in'      => 'حالة الكسوة غير صالحة.',
            'negotiable_check.required'  => 'تحديد قابلية التفاوض مطلوب.',
            'negotiable_check.boolean'   => 'قابلية التفاوض يجب أن تكون صحيحة أو خاطئة.',

            // Media Uploads Messages
            'images.*.image'             => 'يجب أن تكون الملفات المرفوعة صوراً.',
            'images.*.mimes'             => 'يجب أن تكون الصور من نوع: jpeg, png, jpg, gif, svg.',
            'images.*.max'               => 'يجب ألا يتجاوز حجم كل صورة 2 ميغابايت.',
            'video.file'                 => 'يجب أن يكون الفيديو ملفاً.',
            'video.mimes'                => 'يجب أن يكون الفيديو من نوع: mp4, mov, avi, wmv.',
            'video.max'                  => 'يجب ألا يتجاوز حجم الفيديو 20 ميغابايت.',
        ];
    }
}
