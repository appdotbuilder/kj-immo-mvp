<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $property = $this->route('property');
        
        // Admin can update any property, agents can only update their own
        return $this->user() && (
            $this->user()->isAdmin() || 
            ($this->user()->isAgent() && $property->user_id === $this->user()->id)
        );
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'surface_area' => 'required|integer|min:1',
            'bedrooms' => 'required|integer|min:0|max:20',
            'city' => 'required|string|max:255',
            'neighborhood' => 'required|string|max:255',
            'status' => 'sometimes|in:pending,published,archived',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Property title is required.',
            'description.required' => 'Property description is required.',
            'price.required' => 'Property price is required.',
            'price.numeric' => 'Price must be a valid number.',
            'price.min' => 'Price cannot be negative.',
            'surface_area.required' => 'Surface area is required.',
            'surface_area.integer' => 'Surface area must be a whole number.',
            'surface_area.min' => 'Surface area must be at least 1 square meter.',
            'bedrooms.required' => 'Number of bedrooms is required.',
            'bedrooms.integer' => 'Number of bedrooms must be a whole number.',
            'bedrooms.min' => 'Number of bedrooms cannot be negative.',
            'bedrooms.max' => 'Maximum 20 bedrooms allowed.',
            'city.required' => 'City is required.',
            'neighborhood.required' => 'Neighborhood is required.',
            'status.in' => 'Status must be pending, published, or archived.',
            'images.*.image' => 'Each file must be an image.',
            'images.*.mimes' => 'Images must be in JPEG, PNG, JPG, or WebP format.',
            'images.*.max' => 'Each image must be smaller than 2MB.',
        ];
    }
}