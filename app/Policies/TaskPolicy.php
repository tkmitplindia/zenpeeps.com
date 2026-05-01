<?php

namespace App\Policies;

use App\Enums\ProjectRole;
use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Task $task): bool
    {
        return $task->board->project->members()
            ->where('users.id', $user->id)
            ->exists();
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Task $task): bool
    {
        $role = $task->board->project->members()
            ->where('users.id', $user->id)
            ->first()?->pivot->role;

        return in_array($role, [ProjectRole::Admin->value, ProjectRole::Collaborator->value], true);
    }

    public function delete(User $user, Task $task): bool
    {
        $role = $task->board->project->members()
            ->where('users.id', $user->id)
            ->first()?->pivot->role;

        return in_array($role, [ProjectRole::Admin->value, ProjectRole::Collaborator->value], true);
    }

    public function restore(User $user, Task $task): bool
    {
        return $this->delete($user, $task);
    }

    public function forceDelete(User $user, Task $task): bool
    {
        return $this->delete($user, $task);
    }
}
