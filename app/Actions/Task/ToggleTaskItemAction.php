<?php

namespace App\Actions\Task;

use App\Models\TaskItem;
use Illuminate\Support\Facades\DB;

class ToggleTaskItemAction
{
    public function handle(TaskItem $item): TaskItem
    {
        return DB::transaction(function () use ($item): TaskItem {
            $item->update(['done' => ! $item->done]);

            return $item;
        });
    }
}
