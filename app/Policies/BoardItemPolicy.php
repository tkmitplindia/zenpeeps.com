<?php

namespace App\Policies;

use App\Models\Board;
use App\Models\BoardItem;
use App\Models\User;

class BoardItemPolicy
{
    public function viewAny(User $user, Board $board): bool
    {
        return $this->isMember($user, $board);
    }

    public function view(User $user, BoardItem $boardItem): bool
    {
        return $this->isMember($user, $boardItem->board);
    }

    public function create(User $user, Board $board): bool
    {
        return $this->isMember($user, $board);
    }

    public function update(User $user, BoardItem $boardItem): bool
    {
        return $this->isMember($user, $boardItem->board);
    }

    public function delete(User $user, BoardItem $boardItem): bool
    {
        return $this->isMember($user, $boardItem->board);
    }

    public function restore(User $user, BoardItem $boardItem): bool
    {
        return $this->isMember($user, $boardItem->board);
    }

    public function forceDelete(User $user, BoardItem $boardItem): bool
    {
        return $this->isMember($user, $boardItem->board);
    }

    private function isMember(User $user, ?Board $board): bool
    {
        if ($board === null) {
            return false;
        }

        return $board->members()->where('user_id', $user->id)->exists();
    }
}
