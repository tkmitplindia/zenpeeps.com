<?php

namespace App\Actions\Subscription;

use App\Models\Project;
use App\Services\Payments\PaymentProvider;
use App\Support\RechargePack;
use App\Support\RechargePacks;
use Illuminate\Support\Facades\DB;

class PurchaseRechargeAction
{
    public function __construct(private readonly PaymentProvider $payments) {}

    public function handle(Project $project, string $packKey): void
    {
        $pack = RechargePacks::find($packKey);

        DB::transaction(function () use ($project, $pack): void {
            $this->payments->charge($project, $pack);
            $this->incrementBalance($project, $pack);
        });
    }

    private function incrementBalance(Project $project, RechargePack $pack): void
    {
        $project->limits()->update([
            $pack->limitsColumn => DB::raw("{$pack->limitsColumn} + {$pack->amount}"),
        ]);
    }
}
