<?php

namespace App\Actions\Board;

use App\Models\Board;
use App\Models\Task;

class MoveTaskAction
{
    public function handle(Board $board, Task $task, string $boardColumnId, int $position): void
    {
        $oldColumnId = $task->board_column_id;

        $task->update([
            'board_column_id' => $boardColumnId,
            'position' => $position,
        ]);

        $this->recompact($board, $boardColumnId);

        if ($oldColumnId !== $boardColumnId) {
            $this->recompact($board, $oldColumnId);
        }
    }

    private function recompact(Board $board, string $columnId): void
    {
        $tasks = $board->columns()
            ->where('board_columns.id', $columnId)
            ->first()
            ?->tasks()
            ->orderBy('position')
            ->get() ?? collect();

        foreach ($tasks as $index => $t) {
            $t->timestamps = false;
            $t->update(['position' => $index]);
        }
    }
}
