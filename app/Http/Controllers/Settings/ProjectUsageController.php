<?php

namespace App\Http\Controllers\Settings;

use App\Actions\Project\StoreProjectAction;
use App\Enums\UsageType;
use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Support\Plans;
use Inertia\Inertia;
use Inertia\Response;

class ProjectUsageController extends Controller
{
    public function edit(Project $project): Response
    {
        $this->authorize('view', $project);

        $project->loadMissing('limits');

        if ($project->limits === null) {
            (new StoreProjectAction)->seedLimits($project, $project->plan);
            $project->load('limits');
        }

        $plan = Plans::for($project->plan);
        $limits = $project->limits;

        $usedByType = $project->usage()
            ->currentPeriod($project)
            ->selectRaw('type, COALESCE(SUM(amount), 0) as total')
            ->groupBy('type')
            ->pluck('total', 'type');

        $resources = [
            [
                'key' => 'ai_tokens',
                'label' => 'AI Tokens',
                'unit' => 'tokens',
                'used' => (int) ($usedByType[UsageType::AiTokens->value] ?? 0),
                'total' => $limits->ai_tokens_included + $limits->recharge_ai_tokens,
            ],
            [
                'key' => 'meeting_minutes',
                'label' => 'Meeting Minutes',
                'unit' => 'minutes',
                'used' => (int) ($usedByType[UsageType::MeetingMinutes->value] ?? 0),
                'total' => $plan->meetingMinutes + $limits->recharge_meeting_minutes,
            ],
            [
                'key' => 'recording_minutes',
                'label' => 'Recording',
                'unit' => 'minutes',
                'used' => (int) ($usedByType[UsageType::RecordingMinutes->value] ?? 0),
                'total' => $plan->recordingMinutes + $limits->recharge_recording_minutes,
            ],
            [
                'key' => 'transcript_minutes',
                'label' => 'Transcripts',
                'unit' => 'minutes',
                'used' => (int) ($usedByType[UsageType::TranscriptMinutes->value] ?? 0),
                'total' => $plan->transcriptMinutes + $limits->recharge_transcript_minutes,
            ],
            [
                'key' => 'storage',
                'label' => 'Storage',
                'unit' => 'bytes',
                'used' => $project->usedStorageBytes(),
                'total' => $plan->storageBytes + $limits->recharge_storage_bytes,
            ],
        ];

        return Inertia::render('settings/usage', [
            'project' => $project,
            'period' => [
                'starts_at' => $limits->current_period_starts_at,
                'ends_at' => $limits->current_period_ends_at,
            ],
            'resources' => $resources,
        ]);
    }
}
