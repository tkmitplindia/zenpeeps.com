<?php

namespace App\Actions\Project;

use App\Enums\Plan;
use App\Enums\ProjectRole;
use App\Enums\SubscriptionStatus;
use App\Models\Project;
use App\Models\User;
use App\Support\Plans;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StoreProjectAction
{
    /**
     * @param  array{name: string, description?: ?string, plan?: ?string}  $data
     */
    public function handle(User $owner, array $data): Project
    {
        return DB::transaction(function () use ($owner, $data): Project {
            $plan = isset($data['plan']) ? Plan::from($data['plan']) : Plan::Spark;

            $project = Project::create([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'owner_id' => $owner->id,
                'plan' => $plan,
            ]);

            $project->members()->attach($owner->id, [
                'id' => (string) Str::orderedUuid(),
                'role' => ProjectRole::Admin->value,
                'joined_at' => now(),
            ]);

            $this->seedLimits($project, $plan);

            return $project;
        });
    }

    public function seedLimits(Project $project, Plan $plan): void
    {
        $details = Plans::for($plan);
        $isSpark = $plan === Plan::Spark;

        $project->limits()->create([
            'subscription_status' => SubscriptionStatus::Active,
            'current_period_starts_at' => now(),
            'current_period_ends_at' => now()->addMonth(),
            'ai_tokens_included' => $details->aiTokensMonthly,
            'recharge_ai_tokens' => $isSpark ? 1_000_000 : 0,
            'trial_tokens_granted_at' => $isSpark ? now() : null,
        ]);
    }
}
