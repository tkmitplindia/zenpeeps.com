<?php

namespace App\Policies;

use App\Enums\ProjectRole;
use App\Models\Board;
use App\Models\User;

class BoardPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Board $board): bool
    {
        return $board->project->members()->where('users.id', $user->id)->exists();
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Board $board): bool
    {
        $role = $board->project->members()
            ->where('users.id', $user->id)
            ->first()?->pivot->role;

        return in_array($role, [ProjectRole::Admin->value, ProjectRole::Collaborator->value], true);
    }

    public function delete(User $user, Board $board): bool
    {
        $role = $board->project->members()
            ->where('users.id', $user->id)
            ->first()?->pivot->role;

        return $role === ProjectRole::Admin->value;
    }

    public function restore(User $user, Board $board): bool
    {
        return $this->delete($user, $board);
    }

    public function forceDelete(User $user, Board $board): bool
    {
        return $this->delete($user, $board);
    }
}
