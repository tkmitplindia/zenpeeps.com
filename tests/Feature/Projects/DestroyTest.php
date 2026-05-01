<?php

use App\Actions\Project\StoreProjectAction;
use App\Enums\ProjectRole;
use App\Models\Project;
use App\Models\User;

test('non-member gets 403', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    $this->actingAs($stranger)
        ->withSession(['current_project_id' => $project->id])
        ->delete(route('projects.destroy', $project))
        ->assertForbidden();
});

test('admin (non-owner) cannot delete the project', function () {
    $owner = User::factory()->create();
    $admin = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);
    attachMember($project, $admin, ProjectRole::Admin);

    $this->actingAs($admin)
        ->withSession(['current_project_id' => $project->id])
        ->delete(route('projects.destroy', $project))
        ->assertForbidden();

    expect(Project::find($project->id))->not->toBeNull();
});

test('owner can soft-delete the project', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    $this->actingAs($owner)
        ->withSession(['current_project_id' => $project->id])
        ->delete(route('projects.destroy', $project))
        ->assertRedirect(route('projects.index'));

    expect(Project::find($project->id))->toBeNull()
        ->and(Project::withTrashed()->find($project->id)?->trashed())->toBeTrue();
});

test('destroy clears the current project from session when it matches', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    $this->actingAs($owner)
        ->withSession(['current_project_id' => $project->id])
        ->delete(route('projects.destroy', $project));

    expect(session('current_project_id'))->toBeNull();
});
