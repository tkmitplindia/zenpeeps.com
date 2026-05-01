<?php

namespace App\Actions\Task;

use App\Models\Task;

class ShowTaskAction
{
    /**
     * @return array{task: Task, previousTask: Task|null, nextTask: Task|null}
     */
    public function handle(Task $task): array
    {
        $task->load(['assignees', 'items', 'labels', 'column', 'board']);

        // Derive all tasks in the board ordered by column position then task position
        $boardTasks = Task::where('tasks.board_id', $task->board_id)
            ->join('board_columns', 'tasks.board_column_id', '=', 'board_columns.id')
            ->orderBy('board_columns.position')
            ->orderBy('tasks.position')
            ->select('tasks.id')
            ->pluck('tasks.id')
            ->values();

        $currentIndex = $boardTasks->search($task->id);

        $previousTask = $currentIndex > 0
            ? Task::find($boardTasks[$currentIndex - 1])
            : null;

        $nextTask = $currentIndex < $boardTasks->count() - 1
            ? Task::find($boardTasks[$currentIndex + 1])
            : null;

        return compact('task', 'previousTask', 'nextTask');
    }
}
