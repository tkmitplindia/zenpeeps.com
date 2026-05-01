<?php

namespace App\Console\Commands;

use App\Models\ProjectLimits;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('billing:reset-period')]
#[Description('Advance the billing period for projects whose period has ended. MVP fallback — production should use Stripe invoice.paid webhook instead.')]
class BillingResetPeriod extends Command
{
    public function handle(): int
    {
        $expired = ProjectLimits::query()
            ->where('current_period_ends_at', '<=', now())
            ->get();

        foreach ($expired as $limits) {
            $limits->update([
                'current_period_starts_at' => $limits->current_period_ends_at,
                'current_period_ends_at' => $limits->current_period_ends_at->addMonth(),
            ]);
        }

        $this->info("Reset billing period for {$expired->count()} project(s).");

        return self::SUCCESS;
    }
}
