<?php

use App\Actions\Project\StoreProjectAction;
use App\Enums\ProjectRole;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guest is redirected to login', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    $this->withSession(['current_project_id' => $project->id])
        ->get(route('projects.show', $project))
        ->assertRedirect(route('login'));
});

test('non-member gets 403', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    $this->actingAs($stranger)
        ->withSession(['current_project_id' => $project->id])
        ->get(route('projects.show', $project))
        ->assertForbidden();
});

test('member can view project settings', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);
    attachMember($project, $member, ProjectRole::Collaborator);

    $response = $this->actingAs($member)
        ->withSession(['current_project_id' => $project->id])
        ->get(route('projects.show', $project));

    $response->assertOk();
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('settings/projects')
            ->where('project.id', $project->id)
            ->has('members', 2)
            ->has('roles', 3)
    );
});

test('show writes the project id to session', function () {
    $owner = User::factory()->create();
    $other = (new StoreProjectAction)->handle($owner, ['name' => 'Other']);
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    $this->actingAs($owner)
        ->withSession(['current_project_id' => $other->id])
        ->get(route('projects.show', $project));

    expect(session('current_project_id'))->toBe($project->id);
});
