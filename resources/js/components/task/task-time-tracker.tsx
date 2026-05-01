import { router } from '@inertiajs/react';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { startTimer, stopTimer } from '@/actions/App/Http/Controllers/TaskController';
import type { Task } from '@/types';

type Props = {
    task: Task;
};

function formatSeconds(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) {
        return `${h}h ${m}m`;
    }
    return `${m}m`;
}

export function TaskTimeTracker({ task }: Props) {
    const isRunning = task.time_tracker_started_at !== null;

    const [liveElapsed, setLiveElapsed] = useState<number>(() => {
        if (isRunning && task.time_tracker_started_at) {
            const startedAt = new Date(task.time_tracker_started_at).getTime();
            return task.elapsed_seconds + Math.floor((Date.now() - startedAt) / 1000);
        }
        return task.elapsed_seconds;
    });

    useEffect(() => {
        if (!isRunning) {
            setLiveElapsed(task.elapsed_seconds);
            return;
        }

        const interval = setInterval(() => {
            if (task.time_tracker_started_at) {
                const startedAt = new Date(task.time_tracker_started_at).getTime();
                setLiveElapsed(
                    task.elapsed_seconds + Math.floor((Date.now() - startedAt) / 1000),
                );
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, task.elapsed_seconds, task.time_tracker_started_at]);

    const estimateSeconds = task.estimate_minutes ? task.estimate_minutes * 60 : null;
    const pct =
        estimateSeconds && estimateSeconds > 0
            ? Math.min(100, Math.round((liveElapsed / estimateSeconds) * 100))
            : 0;

    function handleStart() {
        router.post(startTimer(task.id).url, {}, { preserveScroll: true });
    }

    function handleStop() {
        router.post(stopTimer(task.id).url, {}, { preserveScroll: true });
    }

    return (
        <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Time Tracker
            </p>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="size-4 text-muted-foreground" />
                    <span>
                        {formatSeconds(liveElapsed)} elapsed
                        {estimateSeconds
                            ? ` of estimated ${formatSeconds(estimateSeconds)}`
                            : ''}
                    </span>
                </div>
                {isRunning ? (
                    <Button size="sm" variant="destructive" onClick={handleStop}>
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
