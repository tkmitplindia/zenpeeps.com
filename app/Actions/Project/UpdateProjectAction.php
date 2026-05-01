<?php

namespace App\Actions\Project;

use App\Enums\Plan;
use App\Models\Project;
use App\Support\Plans;
use Illuminate\Support\Facades\DB;

class UpdateProjectAction
{
    /**
     * @param  array{name?: string, description?: ?string, plan?: string}  $data
     */
    public function handle(Project $project, array $data): Project
    {
        return DB::transaction(function () use ($project, $data): Project {
            $project->update($data);

            if (array_key_exists('plan', $data)) {
                $plan = Plan::from($data['plan']);
                $project->limits()->update([
                    'ai_tokens_included' => Plans::for($plan)->aiTokensMonthly,
                ]);
            }

            return $project->fresh();
        });
    }
}
