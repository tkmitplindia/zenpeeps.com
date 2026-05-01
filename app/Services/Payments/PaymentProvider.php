<?php

namespace App\Services\Payments;

use App\Models\Project;
use App\Support\RechargePack;

interface PaymentProvider
{
    /**
     * Charge the project for a recharge pack.
     * Throws on failure; returns silently on success.
     */
    public function charge(Project $project, RechargePack $pack): void;
}
