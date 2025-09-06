<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_admin_dashboard()
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->get('/admin');
        $response->assertStatus(200);
    }

    public function test_non_admin_cannot_access_admin_dashboard()
    {
        $agent = User::factory()->agent()->create();
        $client = User::factory()->client()->create();

        $response = $this->actingAs($agent)->get('/admin');
        $response->assertForbidden();

        $response = $this->actingAs($client)->get('/admin');
        $response->assertForbidden();
    }

    public function test_admin_can_update_property_status()
    {
        $admin = User::factory()->admin()->create();
        $agent = User::factory()->agent()->create();
        $property = Property::factory()->pending()->for($agent)->create();

        $response = $this->actingAs($admin)->patch("/admin/properties/{$property->id}", [
            'status' => 'published',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('properties', [
            'id' => $property->id,
            'status' => 'published',
        ]);
    }

    public function test_admin_can_manage_users()
    {
        $admin = User::factory()->admin()->create();
        $client = User::factory()->client()->create();

        // Test updating user role
        $response = $this->actingAs($admin)->patch("/admin/users/{$client->id}", [
            'role' => 'agent',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $client->id,
            'role' => 'agent',
        ]);
    }

    public function test_admin_can_delete_users()
    {
        $admin1 = User::factory()->admin()->create();
        $admin2 = User::factory()->admin()->create(); // Create second admin
        $client = User::factory()->client()->create();

        // Admin can delete regular users
        $response = $this->actingAs($admin1)->delete("/admin/users/{$client->id}");
        $response->assertRedirect();
        $this->assertDatabaseMissing('users', ['id' => $client->id]);

        // Admin cannot delete the last admin
        $response = $this->actingAs($admin1)->delete("/admin/users/{$admin2->id}");
        $response->assertRedirect();

        $response = $this->actingAs($admin2)->delete("/admin/users/{$admin1->id}");
        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['id' => $admin1->id]); // Should still exist
    }
}