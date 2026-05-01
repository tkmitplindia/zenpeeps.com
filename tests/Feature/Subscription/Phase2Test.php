<?php

use App\Actions\Project\StoreProjectAction;
use App\Actions\Subscription\PurchaseRechargeAction;
use App\Enums\Plan;
use App\Enums\SubscriptionStatus;
use App\Enums\UsageType;
use App\Models\FakePayment;
use App\Models\ProjectUsage;
use App\Models\User;
use App\Services\Payments\FakePaymentProvider;
use App\Support\Plans;
use App\Support\RechargePacks;

// ── Plans matrix ─────────────────────────────────────────────────────────────

test('Plans::for returns correct values for each plan', function () {
    expect(Plans::for(Plan::Spark)->priceCents)->toBe(0)
        ->and(Plans::for(Plan::Spark)->boardLimit)->toBe(1)
        ->and(Plans::for(Plan::Spark)->aiTokensMonthly)->toBe(0);

    expect(Plans::for(Plan::Basic)->priceCents)->toBe(2000)
        ->and(Plans::for(Plan::Basic)->aiTokensMonthly)->toBe(1_000_000);

    expect(Plans::for(Plan::Pro)->aiTokensMonthly)->toBe(5_000_000);

    expect(Plans::for(Plan::Advanced)->boardLimit)->toBe(0)
        ->and(Plans::for(Plan::Advanced)->includesRecordings)->toBeTrue()
        ->and(Plans::for(Plan::Advanced)->includesTranscripts)->toBeTrue()
        ->and(Plans::for(Plan::Advanced)->aiTokensMonthly)->toBe(10_000_000);
});

// ── StoreProjectAction seeds limits ──────────────────────────────────────────

test('creating a Spark project seeds a trial token grant', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Spark Co']);

    $project->load('limits');

    expect($project->limits)->not->toBeNull()
        ->and($project->limits->subscription_status)->toBe(SubscriptionStatus::Active)
        ->and($project->limits->ai_tokens_included)->toBe(0)
        ->and($project->limits->recharge_ai_tokens)->toBe(1_000_000)
        ->and($project->limits->trial_tokens_granted_at)->not->toBeNull()
        ->and($project->limits->current_period_ends_at)->toBeGreaterThan(now());
});

test('creating a Pro project seeds monthly token allowance with no trial grant', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Pro Co', 'plan' => 'pro']);

    $project->load('limits');

    expect($project->limits->ai_tokens_included)->toBe(5_000_000)
        ->and($project->limits->recharge_ai_tokens)->toBe(0)
        ->and($project->limits->trial_tokens_granted_at)->toBeNull();
});

// ── Quota accessors ───────────────────────────────────────────────────────────

test('availableAiTokens returns full allowance when no usage exists', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme', 'plan' => 'basic']);
    $project->load('limits');

    expect($project->availableAiTokens())->toBe(1_000_000);
});

test('availableAiTokens decreases as usage is recorded', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme', 'plan' => 'basic']);
    $project->load('limits');

    ProjectUsage::factory()->create([
        'project_id' => $project->id,
        'type' => UsageType::AiTokens,
        'amount' => 200_000,
    ]);

    expect($project->availableAiTokens())->toBe(800_000);
});

test('availableAiTokens never goes below zero', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme', 'plan' => 'basic']);
    $project->load('limits');

    ProjectUsage::factory()->create([
        'project_id' => $project->id,
        'type' => UsageType::AiTokens,
        'amount' => 2_000_000,
    ]);

    expect($project->availableAiTokens())->toBe(0);
});

test('usage outside the current period is excluded from quota', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme', 'plan' => 'basic']);
    $project->load('limits');

    ProjectUsage::factory()->create([
        'project_id' => $project->id,
        'type' => UsageType::AiTokens,
        'amount' => 500_000,
        'created_at' => now()->subMonths(2),
    ]);

    expect($project->availableAiTokens())->toBe(1_000_000);
});

// ── Recharge balances stack ───────────────────────────────────────────────────

test('purchasing a recharge pack increments the correct limits column', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme', 'plan' => 'basic']);
    $project->load('limits');

    $action = new PurchaseRechargeAction(new FakePaymentProvider);
    $action->handle($project, 'ai_tokens');

    $project->limits->refresh();

    expect($project->limits->recharge_ai_tokens)->toBe(1_000_000);
});

test('recharge balances stack with multiple purchases', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme', 'plan' => 'basic']);
    $project->load('limits');

    $action = new PurchaseRechargeAction(new FakePaymentProvider);
    $action->handle($project, 'ai_tokens');
    $action->handle($project, 'ai_tokens');

    $project->limits->refresh();

    expect($project->limits->recharge_ai_tokens)->toBe(2_000_000);
});

test('recharge increases available tokens', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme', 'plan' => 'basic']);
    $project->load('limits');

    (new PurchaseRechargeAction(new FakePaymentProvider))->handle($project, 'ai_tokens');
    $project->load('limits');

    expect($project->availableAiTokens())->toBe(2_000_000);
});

// ── Fake payment provider ─────────────────────────────────────────────────────

test('fake provider records a FakePayment row', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    (new PurchaseRechargeAction(new FakePaymentProvider))->handle($project, 'meeting_minutes');

    $pack = RechargePacks::find('meeting_minutes');

    expect(FakePayment::where('project_id', $project->id)->first())
        ->not->toBeNull()
        ->pack_key->toBe('meeting_minutes')
        ->amount_cents->toBe($pack->priceCents);
});

// ── Period reset ──────────────────────────────────────────────────────────────

test('billing:reset-period advances period dates for expired projects', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    $project->limits()->update([
        'current_period_starts_at' => now()->subMonths(2),
        'current_period_ends_at' => now()->subDay(),
    ]);

    $this->artisan('billing:reset-period')->assertSuccessful();

    $project->limits->refresh();

    expect($project->limits->current_period_ends_at)->toBeGreaterThan(now());
});

test('billing:reset-period does not advance periods that have not ended', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);

    $originalEnd = $project->limits->current_period_ends_at;

    $this->artisan('billing:reset-period')->assertSuccessful();

    $project->limits->refresh();

    expect($project->limits->current_period_ends_at->eq($originalEnd))->toBeTrue();
});

test('billing:reset-period scopes usage so old usage falls outside new period', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme', 'plan' => 'basic']);

    $project->limits()->update([
        'current_period_starts_at' => now()->subMonths(2),
        'current_period_ends_at' => now()->subDay(),
    ]);

    ProjectUsage::factory()->create([
        'project_id' => $project->id,
        'type' => UsageType::AiTokens,
        'amount' => 500_000,
        'created_at' => now()->subMonths(2),
    ]);

    $this->artisan('billing:reset-period')->assertSuccessful();

    $project->load('limits');

    expect($project->availableAiTokens())->toBe(1_000_000);
});

// ── Spark trial is one-time ───────────────────────────────────────────────────

test('Spark trial_tokens_granted_at is not changed by period reset', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Spark Co']);
    $project->load('limits');

    $grantedAt = $project->limits->trial_tokens_granted_at;

    $project->limits()->update([
        'current_period_starts_at' => now()->subMonths(2),
        'current_period_ends_at' => now()->subDay(),
    ]);

    $this->artisan('billing:reset-period')->assertSuccessful();

    $project->limits->refresh();

    expect($project->limits->trial_tokens_granted_at->eq($grantedAt))->toBeTrue();
});
