<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@kj-immo.com',
        ]);

        // Create agent users
        User::factory()->agent()->count(3)->create();

        // Create client users
        User::factory()->client()->count(6)->create();

        // Create test user
        User::factory()->client()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Seed properties with images
        $this->call([
            PropertySeeder::class,
        ]);
    }
}