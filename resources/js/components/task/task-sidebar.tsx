import { Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskTimeTracker } from '@/components/task/task-time-tracker';
import { update } from '@/actions/App/Http/Controllers/TaskController';
import { show } from '@/actions/App/Http/Controllers/TaskController';
import type { Board, BoardColumn, Task } from '@/types';

type Props = {
    task: Task;
    board: Board;
    previousTask: Task | null;
    nextTask: Task | null;
};

const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;

function PriorityIcon({ priority }: { priority: string }) {
    const colors: Record<string, string> = {
        low: 'text-blue-500',
        medium: 'text-yellow-500',
        high: 'text-orange-500',
        urgent: 'text-red-500',
    };
    return (
        <span className={`text-xs font-semibold capitalize ${colors[priority] ?? ''}`}>
            {priority}
        </span>
    );
}

export function TaskSidebar({ task, board, previousTask, nextTask }: Props) {
    const columns = (board.columns ?? []) as BoardColumn[];

    function handleColumnChange(columnId: string) {
        router.patch(update(task.id).url, { board_column_id: columnId }, { preserveScroll: true });
    }

    function handlePriorityChange(priority: string) {
        router.patch(update(task.id).url, { priority }, { preserveScroll: true });
    }

    return (
        <aside className="flex w-72 shrink-0 flex-col gap-6 rounded-xl border bg-card p-4">
            {/* Column */}
            <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Column
                </p>
                <Select
                    value={task.board_column_id}
                    onValueChange={handleColumnChange}
                >
                    <SelectTrigger className="h-9">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {columns.map((col) => (
                            <SelectItem key={col.id} value={col.id}>
                                {col.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Priority
                </p>
                <Select value={task.priority} onValueChange={handlePriorityChange}>
                    <SelectTrigger className="h-9">
                        <SelectValue>
                            <PriorityIcon priority={task.priority} />
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {PRIORITIES.map((p) => (
                            <SelectItem key={p} value={p}>
                                <PriorityIcon priority={p} />
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Assigned To */}
            <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Assigned To
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {task.assignees && task.assignees.length > 0 ? (
                        task.assignees.map((a) => (
                            <div
                                key={a.id}
                                className="flex items-center gap-1.5 rounded-full border bg-muted px-2 py-0.5 text-xs"
                                title={a.name}
                            >
                                <div className="flex size-5 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
                                    {a.name
                                        .split(' ')
                                        .map((n: string) => n[0])
                                        .join('')
                                        .slice(0, 2)}
                                </div>
                                {a.name}
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-muted-foreground">Unassigned</p>
                    )}
                </div>
            </div>

            {/* Tags / Labels */}
            <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {task.labels && task.labels.length > 0 ? (
                        task.labels.map((label) => (
                            <span
                                key={label.id}
                                className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                                style={{ backgroundColor: label.color }}
                            >
                                {label.name}
                            </span>
                        ))
                    ) : (
                        <p className="text-xs text-muted-foreground">No tags</p>
                    )}
                </div>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Due Date
                </p>
                <p className="text-sm">
                    {task.due_date
                        ? new Date(task.due_date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                          })
                        : <span className="text-muted-foreground">Not set</span>}
                </p>
            </div>

            {/* Estimate */}
            <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Estimate
                </p>
                <p className="text-sm">
                    {task.estimate_minutes
                        ? `${Math.floor(task.estimate_minutes / 60)}h ${task.estimate_minutes % 60}m`
                        : <span className="text-muted-foreground">Not set</span>}
                </p>
            </div>

            {/* Time Tracker */}
            <TaskTimeTracker task={task} />

            {/* Prev / Next navigation */}
            <div className="mt-auto flex gap-2 border-t pt-4">
                {previousTask ? (
                    <Link
                        href={show(previousTask.id).url}
                        className="flex flex-1 items-center gap-1 rounded-md border px-2 py-1.5 text-xs hover:bg-muted"
                    >
                        <ChevronLeft className="size-3.5 shrink-0" />
                        <span className="truncate">{previousTask.title}</span>
                    </Link>
                ) : (
                    <div className="flex-1" />
                )}
                {nextTask && (
                    <Link
                        href={show(nextTask.id).url}
                        className="flex flex-1 items-center justify-end gap-1 rounded-md border px-2 py-1.5 text-xs hover:bg-muted"
                    >
                        <span className="truncate">{nextTask.title}</span>
                        <ChevronRight className="size-3.5 shrink-0" />
                    </Link>
                )}
            </div>
        </aside>
    );
}
