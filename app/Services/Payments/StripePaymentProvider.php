<?php

namespace App\Services\Payments;

use App\Models\Project;
use App\Support\RechargePack;
use LogicException;

/** Post-MVP: wire Stripe SDK here and handle invoice.paid webhook for period resets. */
class StripePaymentProvider implements PaymentProvider
{
    public function charge(Project $project, RechargePack $pack): void
    {
        throw new LogicException('StripePaymentProvider is not implemented. Replace FakePaymentProvider in production.');
    }
}
