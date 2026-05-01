import { router } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
} from 'lucide-react';
import { show, update } from '@/actions/App/Http/Controllers/TaskController';
import { Button } from '@/components/ui/button';
import type { Task } from '@/types';

type Props = {
    task: Task;
    previousTask: Task | null;
    nextTask: Task | null;
};

export function TaskHeader({ task, previousTask, nextTask }: Props) {
    function handleComplete() {
        router.patch(
            update(task.id).url,
            {
                completed_at: task.completed_at
                    ? null
                    : new Date().toISOString(),
            },
            { preserveScroll: true },
        );
    }

    return (
        <div className="mb-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
                <h1 className="text-2xl leading-tight font-bold">
                    {task.title}
                </h1>
                <p className="mt-0.5 text-xs font-medium tracking-widest text-muted-foreground">
                    TASK #{task.id.slice(0, 8).toUpperCase()}
                </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
                <Button
                    variant={task.completed_at ? 'default' : 'outline'}
                    size="icon"
                    className="size-8"
                    onClick={handleComplete}
                    title={
                        task.completed_at ? 'Mark incomplete' : 'Mark complete'
                    }
                >
                    <CheckCircle2 className="size-4" />
                </Button>
                {previousTask && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => router.visit(show(previousTask.id).url)}
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                )}
                {nextTask && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => router.visit(show(nextTask.id).url)}
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                )}
                <Button variant="outline" size="icon" className="size-8">
                    <MoreHorizontal className="size-4" />
                </Button>
            </div>
        </div>
    );
}
