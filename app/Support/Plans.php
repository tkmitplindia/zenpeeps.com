<?php

namespace App\Support;

use App\Enums\Plan;

/**
 * Immutable value object describing a plan's entitlements.
 *
 * @see PRODUCT.md — Pricing section is the source of truth.
 */
readonly class PlanDetails implements \JsonSerializable
{
    public function __construct(
        public int $priceCents,
        public int $boardLimit,
        public int $meetingMinutes,
        public int $recordingMinutes,
        public int $transcriptMinutes,
        public int $storageBytes,
        public int $aiTokensMonthly,
        public bool $includesRecordings,
        public bool $includesTranscripts,
    ) {}

    public function jsonSerialize(): mixed
    {
        return [
            'price_cents' => $this->priceCents,
            'board_limit' => $this->boardLimit,
            'meeting_minutes' => $this->meetingMinutes,
            'recording_minutes' => $this->recordingMinutes,
            'transcript_minutes' => $this->transcriptMinutes,
            'storage_bytes' => $this->storageBytes,
            'ai_tokens_monthly' => $this->aiTokensMonthly,
            'includes_recordings' => $this->includesRecordings,
            'includes_transcripts' => $this->includesTranscripts,
        ];
    }
}

class Plans
{
    /** @var array<string, PlanDetails> */
    private static array $matrix = [];

    public static function for(Plan $plan): PlanDetails
    {
        return self::matrix()[$plan->value];
    }

    /** @return array<string, PlanDetails> */
    public static function matrix(): array
    {
        if (self::$matrix !== []) {
            return self::$matrix;
        }

        self::$matrix = [
            Plan::Spark->value => new PlanDetails(
                priceCents: 0,
                boardLimit: 1,
                meetingMinutes: 0,
                recordingMinutes: 0,
                transcriptMinutes: 0,
                storageBytes: 10_000_000_000,   // 10 GB
                aiTokensMonthly: 0,             // trial grant only; see StoreProjectAction
                includesRecordings: false,
                includesTranscripts: false,
            ),
            Plan::Basic->value => new PlanDetails(
                priceCents: 2000,
                boardLimit: 3,
                meetingMinutes: 5_000,
                recordingMinutes: 0,
                transcriptMinutes: 0,
                storageBytes: 100_000_000_000,  // 100 GB
                aiTokensMonthly: 1_000_000,
                includesRecordings: false,
                includesTranscripts: false,
            ),
            Plan::Pro->value => new PlanDetails(
                priceCents: 5000,
                boardLimit: 10,
                meetingMinutes: 10_000,
                recordingMinutes: 0,
                transcriptMinutes: 0,
                storageBytes: 150_000_000_000,  // 150 GB
                aiTokensMonthly: 5_000_000,
                includesRecordings: false,
                includesTranscripts: false,
            ),
            Plan::Advanced->value => new PlanDetails(
                priceCents: 10000,
                boardLimit: 0,                  // 0 = unlimited
                meetingMinutes: 100_000,
                recordingMinutes: 5_000,
                transcriptMinutes: 5_000,
                storageBytes: 250_000_000_000,  // 250 GB
                aiTokensMonthly: 10_000_000,
                includesRecordings: true,
                includesTranscripts: true,
            ),
        ];

        return self::$matrix;
    }
}
