<?php

namespace App\Actions\Task;

use App\Models\Task;
use App\Models\TaskItem;
use Illuminate\Support\Facades\DB;

class AddTaskItemAction
{
    public function handle(Task $task, string $text): TaskItem
    {
        return DB::transaction(function () use ($task, $text): TaskItem {
            $position = $task->items()->max('position') + 1;

            return $task->items()->create([
                'text' => $text,
                'done' => false,
                'position' => $position,
            ]);
        });
    }
}
