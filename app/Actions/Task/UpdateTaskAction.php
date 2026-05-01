<?php

namespace App\Actions\Task;

use App\Models\Task;
use Illuminate\Support\Facades\DB;

class UpdateTaskAction
{
    /**
     * @param  array{title?: string, description?: ?string, board_column_id?: string, priority?: string, due_date?: ?string, estimate_minutes?: ?int, assignee_ids?: string[], label_ids?: string[]}  $data
     */
    public function handle(Task $task, array $data): Task
    {
        return DB::transaction(function () use ($task, $data): Task {
            $task->update(array_filter([
                'title' => $data['title'] ?? null,
                'description' => array_key_exists('description', $data) ? $data['description'] : null,
                'board_column_id' => $data['board_column_id'] ?? null,
                'priority' => $data['priority'] ?? null,
                'due_date' => array_key_exists('due_date', $data) ? $data['due_date'] : null,
                'estimate_minutes' => array_key_exists('estimate_minutes', $data) ? $data['estimate_minutes'] : null,
            ], fn ($v) => $v !== null));

            if (array_key_exists('description', $data)) {
                $task->description = $data['description'];
                $task->save();
            }

            if (isset($data['assignee_ids'])) {
                $task->assignees()->sync($data['assignee_ids']);
            }

            if (isset($data['label_ids'])) {
                $task->labels()->sync($data['label_ids']);
            }

            return $task->load(['assignees', 'items', 'labels', 'column']);
        });
    }
}
