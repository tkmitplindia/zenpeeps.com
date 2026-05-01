<?php

namespace App\Support;

/**
 * Immutable value object describing a single recharge pack.
 *
 * @see PRODUCT.md — Recharge Module section is the source of truth.
 */
readonly class RechargePack implements \JsonSerializable
{
    public function __construct(
        public string $key,
        public string $label,
        public int $priceCents,
        public string $limitsColumn,
        public int $amount,
    ) {}

    public function jsonSerialize(): mixed
    {
        return [
            'key' => $this->key,
            'label' => $this->label,
            'price_cents' => $this->priceCents,
            'limits_column' => $this->limitsColumn,
            'amount' => $this->amount,
        ];
    }
}

class RechargePacks
{
    /** @var array<string, RechargePack>|null */
    private static ?array $packs = null;

    public static function all(): array
    {
        return self::packs();
    }

    public static function find(string $key): RechargePack
    {
        $packs = self::packs();

        if (! isset($packs[$key])) {
            throw new \InvalidArgumentException("Unknown recharge pack: {$key}");
        }

        return $packs[$key];
    }

    /** @return array<string, RechargePack> */
    private static function packs(): array
    {
        if (self::$packs !== null) {
            return self::$packs;
        }

        self::$packs = [
            'ai_tokens' => new RechargePack(
                key: 'ai_tokens',
                label: 'AI Tokens (1M)',
                priceCents: 500,
                limitsColumn: 'recharge_ai_tokens',
                amount: 1_000_000,
            ),
            'meeting_minutes' => new RechargePack(
                key: 'meeting_minutes',
                label: 'Meeting Minutes (1,000 min)',
                priceCents: 500,
                limitsColumn: 'recharge_meeting_minutes',
                amount: 1_000,
            ),
            'recording' => new RechargePack(
                key: 'recording',
                label: 'Recording (500 min)',
                priceCents: 500,
                limitsColumn: 'recharge_recording_minutes',
                amount: 500,
            ),
            'transcripts' => new RechargePack(
                key: 'transcripts',
                label: 'Transcripts (500 min)',
                priceCents: 500,
                limitsColumn: 'recharge_transcript_minutes',
                amount: 500,
            ),
            'storage' => new RechargePack(
                key: 'storage',
                label: 'Storage (10 GB)',
                priceCents: 500,
                limitsColumn: 'recharge_storage_bytes',
                amount: 10_000_000_000,
            ),
        ];

        return self::$packs;
    }
}
