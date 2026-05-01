<?php

namespace App\Actions\Project;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class IndexProjectAction
{
    /**
     * @return Collection<int, Project>
     */
    public function handle(User $user): Collection
    {
        return $user->projects()
            ->orderByDesc('projects.created_at')
            ->get();
    }
}
