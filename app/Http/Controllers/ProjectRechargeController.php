<?php

namespace App\Http\Controllers;

use App\Actions\Subscription\PurchaseRechargeAction;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ProjectRechargeController extends Controller
{
    public function store(Request $request, Project $project, PurchaseRechargeAction $action): RedirectResponse
    {
        $this->authorize('update', $project);

        $request->validate(['pack' => ['required', 'string']]);

        $action->handle($project, $request->string('pack')->value());

        return to_route('projects.billing', $project);
    }
}
