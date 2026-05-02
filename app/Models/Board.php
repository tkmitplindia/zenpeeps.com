<?php

namespace App\Models;

use App\Enums\BoardStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Query\Builder;

#[Fillable(['name', 'description', 'status', 'team_id', 'created_by'])]
class Board extends Model
{
    /** @use HasFactory<\Database\Factories\BoardFactory> */
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'status' => BoardStatus::class,
        ];
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    #[Scope]
    protected function ofTeam(Builder $query): Builder
    {
        return $query->where('team_id', request()->user()->current_team_id);
    }

    #[Scope]
    protected function createdBy(Builder $query, User $user): Builder
    {
        return $query->where('created_by', $user->id);
    }

    #[Scope]
    protected function active(Builder $query): Builder
    {
        return $query->where('status', BoardStatus::Active);
    }

    #[Scope]
    protected function archived(Builder $query): Builder
    {
        return $query->where('status', BoardStatus::Archived);
    }
}
