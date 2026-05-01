<?php

use App\Enums\Plan;
use App\Enums\ProjectRole;
use App\Models\Project;
use App\Models\User;

test('guest is redirected to login', function () {
    $this->post(route('projects.store'), ['name' => 'Acme'])
        ->assertRedirect(route('login'));
});

test('authenticated user can create a project with just a name', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('projects.store'), [
        'name' => 'Acme',
    ]);

    $project = Project::firstWhere('name', 'Acme');

    expect($project)->not->toBeNull()
        ->and($project->plan)->toBe(Plan::Spark)
        ->and($project->owner_id)->toBe($user->id);

    $response->assertRedirect(route('dashboard'));
    expect(session('current_project_id'))->toBe($project->id);
});

test('store accepts description and plan', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('projects.store'), [
        'name' => 'Acme',
        'description' => 'A long-running test project',
        'plan' => Plan::Pro->value,
    ]);

    $project = Project::firstWhere('name', 'Acme');

    expect($project->description)->toBe('A long-running test project')
        ->and($project->plan)->toBe(Plan::Pro);
});

test('store attaches the owner as Admin via project_members', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('projects.store'), ['name' => 'Acme']);

    $project = Project::firstWhere('name', 'Acme');
    $member = $project->members()->where('users.id', $user->id)->first();

    expect($member)->not->toBeNull()
        ->and($member->pivot->role)->toBe(ProjectRole::Admin->value);
});

test('store rejects an empty name', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('projects.create'))
        ->post(route('projects.store'), ['name' => ''])
        ->assertSessionHasErrors('name')
        ->assertRedirect(route('projects.create'));
});

test('store rejects an invalid plan value', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('projects.create'))
        ->post(route('projects.store'), [
            'name' => 'Acme',
            'plan' => 'platinum',
        ])
        ->assertSessionHasErrors('plan');
});
