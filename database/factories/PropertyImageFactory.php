<?php

namespace Database\Factories;

use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PropertyImage>
 */
class PropertyImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'property_id' => Property::factory(),
            'path' => 'images/properties/' . fake()->uuid() . '.jpg',
            'alt_text' => fake()->sentence(4),
            'sort_order' => fake()->numberBetween(0, 9),
        ];
    }
}