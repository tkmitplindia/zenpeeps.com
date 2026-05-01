<?php

use App\Actions\Project\StoreProjectAction;
use App\Enums\Plan;
use App\Enums\ProjectRole;
use App\Models\User;

test('non-member gets 403', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    $this->actingAs($stranger)
        ->withSession(['current_project_id' => $project->id])
        ->patch(route('projects.update', $project), ['name' => 'Hacked'])
        ->assertForbidden();
});

test('collaborator cannot update', function () {
    $owner = User::factory()->create();
    $collaborator = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);
    attachMember($project, $collaborator, ProjectRole::Collaborator);

    $this->actingAs($collaborator)
        ->withSession(['current_project_id' => $project->id])
        ->patch(route('projects.update', $project), ['name' => 'Hacked'])
        ->assertForbidden();
});

test('owner can update name and description', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    $response = $this->actingAs($owner)
        ->withSession(['current_project_id' => $project->id])
        ->patch(route('projects.update', $project), [
            'name' => 'Acme Renamed',
            'description' => 'Updated copy',
        ]);

    $response->assertRedirect(route('projects.show', $project));

    $project->refresh();
    expect($project->name)->toBe('Acme Renamed')
        ->and($project->description)->toBe('Updated copy');
});

test('admin (non-owner) can update', function () {
    $owner = User::factory()->create();
    $admin = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);
    attachMember($project, $admin, ProjectRole::Admin);

    $this->actingAs($admin)
        ->withSession(['current_project_id' => $project->id])
        ->patch(route('projects.update', $project), ['name' => 'Acme by Admin'])
        ->assertRedirect(route('projects.show', $project));

    expect($project->fresh()->name)->toBe('Acme by Admin');
});

test('update validates required fields', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    $this->actingAs($owner)
        ->withSession(['current_project_id' => $project->id])
        ->from(route('projects.show', $project))
        ->patch(route('projects.update', $project), ['name' => ''])
        ->assertSessionHasErrors(['name']);
});

// ── Billing plan change ───────────────────────────────────────────────────────

test('owner can change plan via billing route and limits are updated', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme', 'plan' => 'basic']);
    $project->load('limits');

    expect($project->limits->ai_tokens_included)->toBe(1_000_000);

    $this->actingAs($owner)
        ->withSession(['current_project_id' => $project->id])
        ->patch(route('projects.billing.update', $project), ['plan' => Plan::Pro->value])
        ->assertRedirect(route('projects.billing', $project));

    $project->refresh();
    $project->load('limits');

    expect($project->plan)->toBe(Plan::Pro)
        ->and($project->limits->ai_tokens_included)->toBe(5_000_000);
});

test('collaborator cannot change plan', function () {
    $owner = User::factory()->create();
    $collaborator = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);
    attachMember($project, $collaborator, ProjectRole::Collaborator);

    $this->actingAs($collaborator)
        ->withSession(['current_project_id' => $project->id])
        ->patch(route('projects.billing.update', $project), ['plan' => Plan::Pro->value])
        ->assertForbidden();
});
