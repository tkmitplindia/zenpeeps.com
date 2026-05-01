<?php

namespace App\Http\Controllers\Settings;

use App\Actions\Project\ShowProjectAction;
use App\Actions\Project\StoreProjectAction;
use App\Actions\Project\UpdateProjectAction;
use App\Enums\Plan;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProjectBillingRequest;
use App\Models\Project;
use App\Support\Plans;
use App\Support\RechargePacks;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProjectBillingController extends Controller
{
    public function edit(Project $project, ShowProjectAction $action): Response
    {
        $this->authorize('view', $project);

        $project->loadMissing('limits');

        if ($project->limits === null) {
            (new StoreProjectAction)->seedLimits($project, $project->plan);
            $project->load('limits');
        }

        return Inertia::render('settings/billing', [
            'project' => $action->handle($project),
            'limits' => $project->limits,
            'plans' => array_map(fn (Plan $p) => $p->value, Plan::cases()),
            'rechargePacks' => array_values(RechargePacks::all()),
            'planDetails' => Plans::for($project->plan),
        ]);
    }

    public function update(UpdateProjectBillingRequest $request, Project $project, UpdateProjectAction $action): RedirectResponse
    {
        $action->handle($project, $request->validated());

        return to_route('projects.billing', $project);
    }
}
