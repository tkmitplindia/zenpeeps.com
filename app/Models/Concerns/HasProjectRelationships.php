<?php

namespace App\Models\Concerns;

use App\Enums\ProjectRole;
use App\Models\Board;
use App\Models\Project;
use App\Models\ProjectLimits;
use App\Models\ProjectUsage;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

trait HasProjectRelationships
{
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_members')
            ->withPivot(['role', 'joined_at'])
            ->withTimestamps();
    }

    public function admins(): BelongsToMany
    {
        return $this->members()->wherePivot('role', ProjectRole::Admin->value);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_members')
            ->withPivot(['role', 'joined_at'])
            ->withTimestamps();
    }

    public function boards(): HasMany
    {
        return $this->hasMany(Board::class)->orderBy('position');
    }

    public function limits(): HasOne
    {
        return $this->hasOne(ProjectLimits::class);
    }

    public function usage(): HasMany
    {
        return $this->hasMany(ProjectUsage::class);
    }
}
