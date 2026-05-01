<?php

namespace App\Models;

use App\Enums\SubscriptionStatus;
use App\Models\Concerns\HasUuid;
use Carbon\Carbon;
use Database\Factories\ProjectLimitsFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Billing entitlements for a project: plan allowances, recharge balances, and subscription state.
 *
 * @property string $id
 * @property string $project_id
 * @property SubscriptionStatus $subscription_status
 * @property Carbon $current_period_starts_at
 * @property Carbon $current_period_ends_at
 * @property int $ai_tokens_included
 * @property int $recharge_ai_tokens
 * @property int $recharge_meeting_minutes
 * @property int $recharge_recording_minutes
 * @property int $recharge_transcript_minutes
 * @property int $recharge_storage_bytes
 * @property Carbon|null $trial_tokens_granted_at
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Project $project
 */
#[Fillable([
    'project_id',
    'subscription_status',
    'current_period_starts_at',
    'current_period_ends_at',
    'ai_tokens_included',
    'recharge_ai_tokens',
    'recharge_meeting_minutes',
    'recharge_recording_minutes',
    'recharge_transcript_minutes',
    'recharge_storage_bytes',
    'trial_tokens_granted_at',
])]
class ProjectLimits extends Model
{
    /** @use HasFactory<ProjectLimitsFactory> */
    use HasFactory, HasUuid, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'subscription_status' => SubscriptionStatus::class,
            'current_period_starts_at' => 'datetime',
            'current_period_ends_at' => 'datetime',
            'trial_tokens_granted_at' => 'datetime',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
