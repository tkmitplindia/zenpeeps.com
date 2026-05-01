<?php

use App\Actions\Project\StoreProjectAction;
use App\Models\User;

test('user with no projects is redirected to create page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('projects.index'));

    $response->assertRedirect(route('projects.create'));
});

test('user with one project is auto-selected and redirected to dashboard', function () {
    $user = User::factory()->create();
    $project = (new StoreProjectAction)->handle($user, ['name' => 'Solo']);

    $response = $this->actingAs($user)->get(route('projects.index'));

    $response->assertRedirect(route('dashboard'));
    expect(session('current_project_id'))->toBe($project->id);
});

test('user with multiple projects sees the picker page', function () {
    $user = User::factory()->create();
    (new StoreProjectAction)->handle($user, ['name' => 'Alpha']);
    (new StoreProjectAction)->handle($user, ['name' => 'Beta']);

    $response = $this->actingAs($user)->get(route('projects.index'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page->component('projects/index')->has('projects', 2)
    );
});
