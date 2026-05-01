<?php

use App\Actions\Project\StoreProjectAction;
use App\Models\Attachment;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('usedStorageBytes sums attachment sizes for the project', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    Attachment::factory()->count(3)->create([
        'project_id' => $project->id,
        'uploaded_by' => $owner->id,
        'attachable_type' => Project::class,
        'attachable_id' => $project->id,
        'size_bytes' => 1024 * 1024, // 1 MB each
        'disk' => 'local',
    ]);

    expect($project->usedStorageBytes())->toBe(3 * 1024 * 1024);
});

test('usedStorageBytes does not include other projects attachments', function () {
    $owner = User::factory()->create();
    $projectA = (new StoreProjectAction)->handle($owner, ['name' => 'Project A']);
    $projectB = (new StoreProjectAction)->handle($owner, ['name' => 'Project B']);

    Attachment::factory()->create([
        'project_id' => $projectA->id,
        'uploaded_by' => $owner->id,
        'attachable_type' => Project::class,
        'attachable_id' => $projectA->id,
        'size_bytes' => 500_000,
        'disk' => 'local',
    ]);

    expect($projectB->usedStorageBytes())->toBe(0);
});

test('storage shared prop is present after selecting a project', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    $this->actingAs($owner)
        ->withSession(['current_project_id' => $project->id])
        ->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page->has('storage'));
});
