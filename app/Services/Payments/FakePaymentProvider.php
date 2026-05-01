<?php

namespace App\Services\Payments;

use App\Models\FakePayment;
use App\Models\Project;
use App\Support\RechargePack;

/** Always succeeds. Records each charge to fake_payments for test inspection. */
class FakePaymentProvider implements PaymentProvider
{
    public function charge(Project $project, RechargePack $pack): void
    {
        FakePayment::create([
            'project_id' => $project->id,
            'pack_key' => $pack->key,
            'amount_cents' => $pack->priceCents,
        ]);
    }
}
