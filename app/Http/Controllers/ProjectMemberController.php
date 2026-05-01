<?php

namespace App\Http\Controllers;

use App\Actions\Project\InviteMemberAction;
use App\Actions\Project\RemoveMemberAction;
use App\Enums\ProjectRole;
use App\Http\Requests\InviteMemberRequest;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProjectMemberController extends Controller
{
    public function index(Project $project): Response
    {
        $this->authorize('view', $project);

        return Inertia::render('projects/members', [
            'project' => $project->load('owner'),
            'members' => $project->members()->orderBy('users.name')->get(),
            'roles' => array_map(fn (ProjectRole $r) => $r->value, ProjectRole::cases()),
        ]);
    }

    public function store(Project $project, InviteMemberRequest $request, InviteMemberAction $action): RedirectResponse
    {
        $action->handle(
            $project,
            $request->user(),
            $request->validated('email'),
            ProjectRole::from($request->validated('role')),
        );

        return back();
    }

    public function destroy(Project $project, User $user, RemoveMemberAction $action): RedirectResponse
    {
        $this->authorize('update', $project);

        $action->handle($project, $user);

        return back();
    }
}
