import { router } from '@inertiajs/react';
import { differenceInSeconds } from 'date-fns';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    startTimer,
    stopTimer,
} from '@/actions/App/Http/Controllers/TaskController';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { Task } from '@/types';

function formatSeconds(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    if (h > 0) {
        return `${h}h ${m}m`;
    }

    return `${m}m`;
}

export function TaskTimeTracker({ task }: { task: Task }) {
    const isRunning = task.time_tracker_started_at !== null;

    const [, setTick] = useState(0);

    useEffect(() => {
        if (!isRunning) {
            return;
        }

        const interval = setInterval(() => setTick((t) => t + 1), 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    const displayElapsed =
        isRunning && task.time_tracker_started_at
            ? task.elapsed_seconds +
              differenceInSeconds(
                  new Date(),
                  new Date(task.time_tracker_started_at),
              )
            : task.elapsed_seconds;

    const estimateSeconds = task.estimate_minutes
        ? task.estimate_minutes * 60
        : null;
    const pct =
        estimateSeconds && estimateSeconds > 0
            ? Math.min(
                  100,
                  Math.round((displayElapsed / estimateSeconds) * 100),
              )
            : 0;

    function handleStart() {
        router.post(startTimer(task.id).url, {}, { preserveScroll: true });
    }

    function handleStop() {
        router.post(stopTimer(task.id).url, {}, { preserveScroll: true });
    }

    return (
        <div className="space-y-2">
            <span className="sr-only">Time tracker for {task.title}</span>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Time Tracker
            </p>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="size-4 text-muted-foreground" />
                    <span>
                        {formatSeconds(displayElapsed)} elapsed
                        {estimateSeconds
                            ? ` of estimated ${formatSeconds(estimateSeconds)}`
                            : ''}
                    </span>
                </div>
                {isRunning ? (
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleStop}
                    >
                        End Task
                    </Button>
                ) : (
                    <Button size="sm" variant="outline" onClick={handleStart}>
                        Start
                    </Button>
                )}
            </div>
            {estimateSeconds && estimateSeconds > 0 && (
                <Progress value={pct} className="h-1.5" />
            )}
        </div>
    );
}
