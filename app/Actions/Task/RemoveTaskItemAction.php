<?php

namespace App\Actions\Task;

use App\Models\TaskItem;
use Illuminate\Support\Facades\DB;

class RemoveTaskItemAction
{
    public function handle(TaskItem $item): void
    {
        DB::transaction(function () use ($item): void {
            $item->delete();
        });
    }
}
