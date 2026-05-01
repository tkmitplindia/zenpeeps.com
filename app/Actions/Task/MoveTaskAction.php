<?php

namespace App\Actions\Task;

use App\Models\Task;
use Illuminate\Support\Facades\DB;

class MoveTaskAction
{
    public function handle(Task $task, string $boardColumnId, int $position): void
    {
        DB::transaction(function () use ($task, $boardColumnId, $position): void {
            $oldColumnId = $task->board_column_id;

            $task->update([
                'board_column_id' => $boardColumnId,
                'position' => $position,
            ]);

            $this->recompact($boardColumnId);

            if ($oldColumnId !== $boardColumnId) {
                $this->recompact($oldColumnId);
            }
        });
    }

    private function recompact(string $columnId): void
    {
        $tasks = Task::where('board_column_id', $columnId)
            ->orderBy('position')
            ->get();

        foreach ($tasks as $index => $t) {
            $t->timestamps = false;
            $t->update(['position' => $index]);
        }
    }
}
