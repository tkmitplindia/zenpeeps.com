<?php

use App\Actions\Project\StoreProjectAction;
use App\Models\User;

test('guest is redirected to login', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    $this->post(route('projects.select', $project))
        ->assertRedirect(route('login'));
});

test('non-member gets 403', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    $this->actingAs($stranger)
        ->post(route('projects.select', $project))
        ->assertForbidden();
});

test('member sets the session and lands on the dashboard', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    $response = $this->actingAs($owner)->post(route('projects.select', $project));

    $response->assertRedirect(route('dashboard'));
    expect(session('current_project_id'))->toBe($project->id);
});
