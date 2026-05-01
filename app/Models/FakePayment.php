<?php

namespace App\Models;

use Carbon\Carbon;
use Database\Factories\FakePaymentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Payment record written by FakePaymentProvider for test inspection.
 *
 * @property int $id
 * @property string $project_id
 * @property string $pack_key
 * @property int $amount_cents
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property-read Project $project
 */
#[Fillable(['project_id', 'pack_key', 'amount_cents'])]
class FakePayment extends Model
{
    /** @use HasFactory<FakePaymentFactory> */
    use HasFactory;

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
