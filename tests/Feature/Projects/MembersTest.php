<?php

use App\Actions\Project\StoreProjectAction;
use App\Enums\ProjectRole;
use App\Mail\ProjectInvitationMail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    Mail::fake();
});

test('guest cannot invite a member', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    $this->post(route('projects.members.store', $project), [
        'email' => 'new@example.com',
        'role' => ProjectRole::Collaborator->value,
    ])->assertRedirect(route('login'));
});

test('collaborator cannot invite a member', function () {
    $owner = User::factory()->create();
    $collaborator = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);
    attachMember($project, $collaborator, ProjectRole::Collaborator);

    $this->actingAs($collaborator)
        ->withSession(['current_project_id' => $project->id])
        ->post(route('projects.members.store', $project), [
            'email' => 'new@example.com',
            'role' => ProjectRole::Collaborator->value,
        ])
        ->assertForbidden();
});

test('admin invites an existing user — attaches as member and sends mail', function () {
    $owner = User::factory()->create();
    $invitee = User::factory()->create(['email' => 'carol@example.com']);
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    $this->actingAs($owner)
        ->withSession(['current_project_id' => $project->id])
        ->post(route('projects.members.store', $project), [
            'email' => 'carol@example.com',
            'role' => ProjectRole::Collaborator->value,
        ])
        ->assertRedirect();

    expect($project->members()->where('users.id', $invitee->id)->exists())->toBeTrue();
    Mail::assertSent(ProjectInvitationMail::class, fn ($mail) => $mail->hasTo('carol@example.com')
        && $mail->alreadyRegistered === true);
});

test('admin invites a non-user — sends mail without attaching', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    $this->actingAs($owner)
        ->withSession(['current_project_id' => $project->id])
        ->post(route('projects.members.store', $project), [
            'email' => 'newbie@example.com',
            'role' => ProjectRole::Guest->value,
        ])
        ->assertRedirect();

    expect($project->members()->count())->toBe(1);
    Mail::assertSent(ProjectInvitationMail::class, fn ($mail) => $mail->hasTo('newbie@example.com')
        && $mail->alreadyRegistered === false);
});

test('inviting an existing member returns a validation error', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create(['email' => 'dup@example.com']);
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);
    attachMember($project, $member, ProjectRole::Collaborator);

    $this->actingAs($owner)
        ->withSession(['current_project_id' => $project->id])
        ->from(route('projects.show', $project))
        ->post(route('projects.members.store', $project), [
            'email' => 'dup@example.com',
            'role' => ProjectRole::Collaborator->value,
        ])
        ->assertSessionHasErrors('email');

    Mail::assertNothingSent();
});

test('invite request validates email and role', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    $this->actingAs($owner)
        ->withSession(['current_project_id' => $project->id])
        ->from(route('projects.show', $project))
        ->post(route('projects.members.store', $project), [
            'email' => 'not-an-email',
            'role' => 'overlord',
        ])
        ->assertSessionHasErrors(['email', 'role']);
});

test('admin can remove a non-owner member', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);
    attachMember($project, $member, ProjectRole::Collaborator);

    $this->actingAs($owner)
        ->withSession(['current_project_id' => $project->id])
        ->delete(route('projects.members.destroy', [$project, $member]))
        ->assertRedirect();

    expect($project->members()->where('users.id', $member->id)->exists())->toBeFalse()
        ->and($project->members()->count())->toBe(1);
});

test('removing the project owner is rejected', function () {
    $owner = User::factory()->create();
    $admin = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);
    attachMember($project, $admin, ProjectRole::Admin);

    $this->actingAs($admin)
        ->withSession(['current_project_id' => $project->id])
        ->from(route('projects.show', $project))
        ->delete(route('projects.members.destroy', [$project, $owner]))
        ->assertSessionHasErrors('member');

    expect($project->members()->where('users.id', $owner->id)->exists())->toBeTrue();
});

test('project invitation mail renders the role label', function () {
    $owner = User::factory()->create(['name' => 'Alice']);
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    $mail = new ProjectInvitationMail(
        project: $project,
        inviter: $owner,
        role: ProjectRole::Collaborator,
        alreadyRegistered: false,
    );

    $rendered = $mail->render();

    expect($rendered)->toContain('Collaborator');
});

test('collaborator cannot remove a member', function () {
    $owner = User::factory()->create();
    $collaborator = User::factory()->create();
    $other = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);
    attachMember($project, $collaborator, ProjectRole::Collaborator);
    attachMember($project, $other, ProjectRole::Collaborator);

    $this->actingAs($collaborator)
        ->withSession(['current_project_id' => $project->id])
        ->delete(route('projects.members.destroy', [$project, $other]))
        ->assertForbidden();
});
