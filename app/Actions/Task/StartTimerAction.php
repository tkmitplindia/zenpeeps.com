<?php

namespace App\Actions\Task;

use App\Models\Task;
use Illuminate\Support\Facades\DB;

class StartTimerAction
{
    public function handle(Task $task): Task
    {
        return DB::transaction(function () use ($task): Task {
            if ($task->time_tracker_started_at === null) {
                $task->update(['time_tracker_started_at' => now()]);
            }

            return $task;
        });
    }
}
