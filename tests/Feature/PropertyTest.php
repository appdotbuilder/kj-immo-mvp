<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertyTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_can_view_published_properties()
    {
        $user = User::factory()->agent()->create();
        $property = Property::factory()->published()->for($user)->create();

        $response = $this->get('/');
        $response->assertStatus(200);

        $response = $this->get('/properties');
        $response->assertStatus(200);

        $response = $this->get("/properties/{$property->id}");
        $response->assertStatus(200);
    }

    public function test_guests_cannot_view_pending_properties()
    {
        $user = User::factory()->agent()->create();
        $property = Property::factory()->pending()->for($user)->create();

        $response = $this->get("/properties/{$property->id}");
        $response->assertStatus(403);
    }

    public function test_agents_can_create_properties()
    {
        $agent = User::factory()->agent()->create();

        $response = $this->actingAs($agent)->post('/properties', [
            'title' => 'Test Property',
            'description' => 'A beautiful test property',
            'price' => 250000,
            'surface_area' => 120,
            'bedrooms' => 3,
            'city' => 'Brussels',
            'neighborhood' => 'Ixelles',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('properties', [
            'title' => 'Test Property',
            'user_id' => $agent->id,
            'status' => 'pending', // Agents' properties start as pending
        ]);
    }

    public function test_admins_can_create_published_properties()
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->post('/properties', [
            'title' => 'Admin Property',
            'description' => 'An admin test property',
            'price' => 300000,
            'surface_area' => 150,
            'bedrooms' => 4,
            'city' => 'Antwerp',
            'neighborhood' => 'Center',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('properties', [
            'title' => 'Admin Property',
            'user_id' => $admin->id,
            'status' => 'published', // Admin properties are published immediately
        ]);
    }

    public function test_clients_cannot_create_properties()
    {
        $client = User::factory()->client()->create();

        $response = $this->actingAs($client)->post('/properties', [
            'title' => 'Client Property',
            'description' => 'A client test property',
            'price' => 200000,
            'surface_area' => 100,
            'bedrooms' => 2,
            'city' => 'Ghent',
            'neighborhood' => 'Center',
        ]);

        $response->assertForbidden();
    }

    public function test_property_search_filters_work()
    {
        $user = User::factory()->agent()->create();
        
        // Create properties with different attributes
        Property::factory()->published()->for($user)->create([
            'city' => 'Brussels',
            'price' => 250000,
            'bedrooms' => 3,
            'surface_area' => 120,
        ]);

        Property::factory()->published()->for($user)->create([
            'city' => 'Antwerp',
            'price' => 350000,
            'bedrooms' => 4,
            'surface_area' => 180,
        ]);

        // Test city filter
        $response = $this->get('/?city=Brussels');
        $response->assertStatus(200);

        // Test price filter
        $response = $this->get('/?min_price=300000');
        $response->assertStatus(200);

        // Test bedrooms filter
        $response = $this->get('/?bedrooms=3');
        $response->assertStatus(200);
    }
}