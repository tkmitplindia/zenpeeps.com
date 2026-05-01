<?php

namespace App\Actions\Task;

use App\Models\Task;
use Illuminate\Support\Facades\DB;

class StopTimerAction
{
    public function handle(Task $task): Task
    {
        return DB::transaction(function () use ($task): Task {
            if ($task->time_tracker_started_at !== null) {
                $elapsed = $task->time_tracker_started_at->diffInSeconds(now());

                $task->update([
                    'elapsed_seconds' => $task->elapsed_seconds + $elapsed,
                    'time_tracker_started_at' => null,
                ]);
            }

            return $task;
        });
    }
}
