<?php

namespace App\Actions\Task;

use App\Models\Board;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class StoreTaskAction
{
    /**
     * @param  array{title: string, board_column_id: string, description?: ?string, priority?: string, due_date?: ?string, estimate_minutes?: ?int, assignee_ids?: string[]}  $data
     */
    public function handle(Board $board, User $creator, array $data): Task
    {
        return DB::transaction(function () use ($board, $creator, $data): Task {
            $position = Task::where('board_column_id', $data['board_column_id'])->max('position') + 1;

            $task = Task::create([
                'board_id' => $board->id,
                'project_id' => $board->project_id,
                'created_by' => $creator->id,
                'board_column_id' => $data['board_column_id'],
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'priority' => $data['priority'] ?? 'medium',
                'due_date' => $data['due_date'] ?? null,
                'estimate_minutes' => $data['estimate_minutes'] ?? null,
                'position' => $position,
            ]);

            if (! empty($data['assignee_ids'])) {
                $task->assignees()->sync($data['assignee_ids']);
            }

            return $task->load(['assignees', 'items', 'labels', 'column']);
        });
    }
}
