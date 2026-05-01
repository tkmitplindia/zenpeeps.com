<?php

namespace App\Actions\Task;

use App\Models\Task;
use Illuminate\Support\Facades\DB;

class ReorderTaskItemsAction
{
    /**
     * @param  string[]  $orderedIds  Ordered list of TaskItem IDs
     */
    public function handle(Task $task, array $orderedIds): void
    {
        DB::transaction(function () use ($task, $orderedIds): void {
            foreach ($orderedIds as $position => $id) {
                $task->items()->where('id', $id)->update(['position' => $position]);
            }
        });
    }
}
