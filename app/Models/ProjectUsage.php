<?php

namespace App\Models;

use App\Enums\UsageType;
use App\Models\Concerns\HasUuid;
use Carbon\Carbon;
use Database\Factories\ProjectUsageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Append-only consumption event for a project resource (tokens, minutes, etc.).
 *
 * @property string $id
 * @property string $project_id
 * @property UsageType $type
 * @property int $amount
 * @property string|null $description
 * @property Carbon $created_at
 * @property-read Project $project
 */
#[Fillable(['project_id', 'type', 'amount', 'description'])]
class ProjectUsage extends Model
{
    /** @use HasFactory<ProjectUsageFactory> */
    use HasFactory, HasUuid;

    /** Immutable accounting record — no updated_at. */
    const UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => UsageType::class,
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    #[Scope]
    protected function forAiTokens(Builder $query): void
    {
        $query->where('type', UsageType::AiTokens);
    }

    #[Scope]
    protected function forMeetingMinutes(Builder $query): void
    {
        $query->where('type', UsageType::MeetingMinutes);
    }

    #[Scope]
    protected function forRecordingMinutes(Builder $query): void
    {
        $query->where('type', UsageType::RecordingMinutes);
    }

    #[Scope]
    protected function forTranscriptMinutes(Builder $query): void
    {
        $query->where('type', UsageType::TranscriptMinutes);
    }

    /**
     * Scope to the project's current billing period.
     * Requires $project->limits to be eager-loaded.
     */
    #[Scope]
    protected function currentPeriod(Builder $query, Project $project): void
    {
        $query->where('created_at', '>=', $project->limits->current_period_starts_at);
    }
}
