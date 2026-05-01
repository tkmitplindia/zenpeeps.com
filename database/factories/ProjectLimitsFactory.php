<?php

namespace Database\Factories;

use App\Enums\SubscriptionStatus;
use App\Models\Project;
use App\Models\ProjectLimits;
use App\Support\Plans;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProjectLimits>
 */
class ProjectLimitsFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $project = Project::factory()->create();
        $details = Plans::for($project->plan);

        return [
            'project_id' => $project->id,
            'subscription_status' => SubscriptionStatus::Active,
            'current_period_starts_at' => now(),
            'current_period_ends_at' => now()->addMonth(),
            'ai_tokens_included' => $details->aiTokensMonthly,
            'recharge_ai_tokens' => 0,
            'recharge_meeting_minutes' => 0,
            'recharge_recording_minutes' => 0,
            'recharge_transcript_minutes' => 0,
            'recharge_storage_bytes' => 0,
            'trial_tokens_granted_at' => null,
        ];
    }
}
