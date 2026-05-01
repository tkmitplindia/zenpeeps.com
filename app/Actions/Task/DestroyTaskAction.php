<?php

namespace App\Actions\Task;

use App\Models\Task;
use Illuminate\Support\Facades\DB;

class DestroyTaskAction
{
    public function handle(Task $task): void
    {
        DB::transaction(function () use ($task): void {
            $task->delete();
        });
    }
}
