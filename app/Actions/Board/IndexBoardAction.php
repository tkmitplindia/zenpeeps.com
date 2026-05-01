<?php

namespace App\Actions\Board;

use App\Models\Project;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class IndexBoardAction
{
    public function handle(Project $project, int $perPage = 24): LengthAwarePaginator
    {
        return $project->boards()
            ->with(['columns'])
            ->withCount('tasks')
            ->orderBy('position')
            ->paginate($perPage);
    }
}
