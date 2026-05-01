import type { User } from './auth';

export type Plan = 'spark' | 'basic' | 'pro' | 'advanced';

export type ProjectRole = 'admin' | 'collaborator' | 'guest';

export type ProjectLimits = {
    id: string;
    project_id: string;
    subscription_status: 'active' | 'past_due' | 'canceled' | 'trial';
    current_period_starts_at: string;
    current_period_ends_at: string;
    ai_tokens_included: number;
    recharge_ai_tokens: number;
    recharge_meeting_minutes: number;
    recharge_recording_minutes: number;
    recharge_transcript_minutes: number;
    recharge_storage_bytes: number;
    trial_tokens_granted_at: string | null;
};

export type RechargePack = {
    key: string;
    label: string;
    price_cents: number;
    limits_column: string;
    amount: number;
};

export type PlanDetails = {
    price_cents: number;
    board_limit: number;
    meeting_minutes: number;
    recording_minutes: number;
    transcript_minutes: number;
    storage_bytes: number;
    ai_tokens_monthly: number;
    includes_recordings: boolean;
    includes_transcripts: boolean;
};

export type UsageResource = {
    key: string;
    label: string;
    unit: 'tokens' | 'minutes' | 'bytes';
    used: number;
    total: number;
};

export type Project = {
    id: string;
    name: string;
    description: string | null;
    owner_id: string;
    plan: Plan;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

export type ProjectMember = User & {
    pivot: {
        role: ProjectRole;
        joined_at: string;
    };
};
