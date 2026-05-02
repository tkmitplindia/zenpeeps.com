<?php

namespace App\Policies;

use App\Models\Board;
use App\Models\BoardColumn;
use App\Models\User;

class BoardColumnPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user, Board $board): bool
    {
        return $user->can('view', $board);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, BoardColumn $boardColumn): bool
    {
        return $user->can('view', $boardColumn->board);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Board $board): bool
    {
        return $user->can('update', $board);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, BoardColumn $boardColumn): bool
    {
        return $user->can('update', $boardColumn->board);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, BoardColumn $boardColumn): bool
    {
        return $user->can('delete', $boardColumn->board);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, BoardColumn $boardColumn): bool
    {
        return $user->can('restore', $boardColumn->board);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, BoardColumn $boardColumn): bool
    {
        return $user->can('forceDelete', $boardColumn->board);
    }
}
