<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\User;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing agents and admin for property ownership
        $agents = User::agents()->get();
        $admin = User::admins()->first();
        
        if ($agents->isEmpty() && !$admin) {
            // Create some agents if none exist
            $agents = User::factory()->agent()->count(3)->create();
        }
        
        $owners = $agents->isNotEmpty() ? $agents : collect([$admin]);

        // Create 50 properties
        Property::factory(50)
            ->recycle($owners)
            ->create()
            ->each(function (Property $property) {
                // Add 1-5 images per property
                PropertyImage::factory()
                    ->count(fake()->numberBetween(1, 5))
                    ->for($property)
                    ->sequence(fn ($sequence) => ['sort_order' => $sequence->index])
                    ->create();
            });
    }
}