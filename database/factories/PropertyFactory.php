<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Property>
 */
class PropertyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'description' => fake()->paragraphs(3, true),
            'price' => fake()->randomFloat(2, 100000, 2000000),
            'surface_area' => fake()->numberBetween(50, 500),
            'bedrooms' => fake()->numberBetween(1, 6),
            'city' => fake()->city(),
            'neighborhood' => fake()->streetName(),
            'status' => fake()->randomElement(['pending', 'published', 'archived']),
            'user_id' => User::factory(),
        ];
    }

    /**
     * Indicate that the property is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
        ]);
    }

    /**
     * Indicate that the property is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Indicate that the property is archived.
     */
    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'archived',
        ]);
    }

    /**
     * Indicate that the property is a luxury property.
     */
    public function luxury(): static
    {
        return $this->state(fn (array $attributes) => [
            'price' => fake()->randomFloat(2, 1000000, 5000000),
            'surface_area' => fake()->numberBetween(200, 800),
            'bedrooms' => fake()->numberBetween(4, 8),
            'title' => 'Luxury ' . fake()->sentence(2),
        ]);
    }
}