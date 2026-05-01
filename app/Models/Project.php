<?php

namespace App\Models;

use App\Enums\Plan;
use App\Models\Concerns\HasAttachments;
use App\Models\Concerns\HasProjectRelationships;
use App\Models\Concerns\HasUuid;
use App\Models\Concerns\ProjectQuotas;
use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['name', 'description', 'owner_id', 'plan'])]
class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasAttachments;

    use HasFactory;
    use HasProjectRelationships;
    use HasUuid;
    use ProjectQuotas;
    use SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'plan' => Plan::class,
        ];
    }

    public function setCurrentProject(): void
    {
        session()->put('current_project_id', $this->id);
    }
}
