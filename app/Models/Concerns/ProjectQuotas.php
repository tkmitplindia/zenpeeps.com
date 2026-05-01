<?php

namespace App\Models\Concerns;

use App\Models\Attachment;
use App\Support\Plans;

/**
 * Quota accessors for Project. Requires `limits` to be eager-loaded before calling any accessor.
 * Post-MVP: replace per-request aggregation with cached counters under load.
 */
trait ProjectQuotas
{
    public function storageQuotaBytes(): int
    {
        return Plans::for($this->plan)->storageBytes + $this->limits->recharge_storage_bytes;
    }

    /**
     * Returns the total bytes consumed by attachments in this project.
     * Extended in Task 57 to also include PageContent sizes.
     */
    public function usedStorageBytes(): int
    {
        return (int) Attachment::where('project_id', $this->id)->sum('size_bytes');
    }

    public function availableAiTokens(): int
    {
        $included = $this->limits->ai_tokens_included + $this->limits->recharge_ai_tokens;
        $used = $this->usage()->forAiTokens()->currentPeriod($this)->sum('amount');

        return max(0, $included - $used);
    }

    public function availableMeetingMinutes(): int
    {
        $included = Plans::for($this->plan)->meetingMinutes + $this->limits->recharge_meeting_minutes;
        $used = $this->usage()->forMeetingMinutes()->currentPeriod($this)->sum('amount');

        return max(0, $included - $used);
    }

    public function availableRecordingMinutes(): int
    {
        $included = Plans::for($this->plan)->recordingMinutes + $this->limits->recharge_recording_minutes;
        $used = $this->usage()->forRecordingMinutes()->currentPeriod($this)->sum('amount');

        return max(0, $included - $used);
    }

    public function availableTranscriptMinutes(): int
    {
        $included = Plans::for($this->plan)->transcriptMinutes + $this->limits->recharge_transcript_minutes;
        $used = $this->usage()->forTranscriptMinutes()->currentPeriod($this)->sum('amount');

        return max(0, $included - $used);
    }
}
