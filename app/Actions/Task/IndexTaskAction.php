<?php

namespace App\Actions\Task;

use App\Models\Board;
use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

class IndexTaskAction
{
    /**
     * @return Collection<int, Task>
     */
    public function handle(Board $board): Collection
    {
        return $board->tasks()
            ->with(['assignees', 'items', 'labels'])
            ->orderBy('position')
            ->get();
    }
}
