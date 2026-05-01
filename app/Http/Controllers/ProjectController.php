<?php

namespace App\Http\Controllers;

use App\Actions\Project\DestroyProjectAction;
use App\Actions\Project\IndexProjectAction;
use App\Actions\Project\ShowProjectAction;
use App\Actions\Project\StoreProjectAction;
use App\Actions\Project\UpdateProjectAction;
use App\Enums\Plan;
use App\Enums\ProjectRole;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request, IndexProjectAction $action): Response|RedirectResponse
    {
        $this->authorize('viewAny', Project::class);

        $projects = $action->handle($request->user());

        if ($projects->isEmpty()) {
            return to_route('projects.create');
        }

        if ($projects->count() === 1) {
            $projects->first()->setCurrentProject();

            return to_route('dashboard');
        }

        return Inertia::render('projects/index', [
            'projects' => $projects,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Project::class);

        return Inertia::render('projects/create', [
            'plans' => array_map(fn (Plan $p) => $p->value, Plan::cases()),
        ]);
    }

    public function store(StoreProjectRequest $request, StoreProjectAction $action): RedirectResponse
    {
        $project = $action->handle($request->user(), $request->validated());

        $request->session()->put('current_project_id', $project->id);

        return to_route('dashboard');
    }

    public function select(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('view', $project);

        $request->session()->put('current_project_id', $project->id);

        return to_route('dashboard');
    }

    public function show(Request $request, Project $project, ShowProjectAction $action): Response
    {
        $this->authorize('view', $project);

        $request->session()->put('current_project_id', $project->id);

        $project->loadMissing('limits');

        return Inertia::render('settings/projects', [
            'project' => $action->handle($project),
            'members' => $project->members()->orderBy('users.name')->get(),
            'roles' => array_map(fn (ProjectRole $r) => $r->value, ProjectRole::cases()),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project, UpdateProjectAction $action): RedirectResponse
    {
        $project = $action->handle($project, $request->validated());

        $request->session()->put('current_project_id', $project->id);

        return to_route('projects.show', $project);
    }

    public function destroy(Request $request, Project $project, DestroyProjectAction $action): RedirectResponse
    {
        $this->authorize('delete', $project);

        $action->handle($project);

        if ($request->session()->get('current_project_id') === $project->id) {
            $request->session()->forget('current_project_id');
        }

        return to_route('projects.index');
    }
}
