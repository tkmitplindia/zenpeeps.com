import { router } from '@inertiajs/react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskTimeTracker } from '@/components/task/task-time-tracker';
import { show, update } from '@/actions/App/Http/Controllers/TaskController';
import type { Board, BoardColumn, Task } from '@/types';

type Props = {
    task: Task;
    board: Board;
    previousTask: Task | null;
    nextTask: Task | null;
};

export const PRIORITIES = [
    { value: 'low', label: 'Low', color: 'text-blue-500' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
    { value: 'high', label: 'High', color: 'text-orange-500' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-500' },
] as const;

export function SidebarLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">{children}</p>
    );
}

function Avatar({ name }: { name: string }) {
    const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
    return (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {initials}
        </div>
    );
}

export function TaskSidebar({ task, board, previousTask, nextTask }: Props) {
    const columns = (board.columns ?? []) as BoardColumn[];
    const priority = PRIORITIES.find((p) => p.value === task.priority) ?? PRIORITIES[1];
    const estimateHours = task.estimate_minutes
        ? task.estimate_minutes >= 60
            ? `${Math.floor(task.estimate_minutes / 60)}h ${task.estimate_minutes % 60 > 0 ? `${task.estimate_minutes % 60}m` : ''}`.trim()
            : `${task.estimate_minutes}m`
        : null;

    function patch(data: Record<string, unknown>) {
        router.patch(update(task.id).url, data, { preserveScroll: true });
    }

    return (
        <aside className="flex w-[300px] shrink-0 flex-col gap-5 overflow-y-auto border-l bg-card px-5 py-6">
            {/* Column */}
            <div>
                <SidebarLabel>Column</SidebarLabel>
                <Select value={task.board_column_id} onValueChange={(v) => patch({ board_column_id: v })}>
                    <SelectTrigger className="h-9">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {columns.map((col) => (
                            <SelectItem key={col.id} value={col.id}>{col.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Priority */}
            <div>
                <SidebarLabel>Priority</SidebarLabel>
                <Select value={task.priority} onValueChange={(v) => patch({ priority: v })}>
                    <SelectTrigger className="h-9">
                        <SelectValue>
                            <span className="flex items-center gap-2">
                                <Flag className={`size-3.5 ${priority.color}`} />
                                <span className={`text-sm font-medium ${priority.color}`}>{priority.label}</span>
                            </span>
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {PRIORITIES.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                                <span className="flex items-center gap-2">
                                    <Flag className={`size-3.5 ${p.color}`} />
                                    <span className={p.color}>{p.label}</span>
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Assigned To */}
            <div>
                <SidebarLabel>Assigned To</SidebarLabel>
                <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5">
                    {task.assignees && task.assignees.length > 0 ? (
                        task.assignees.map((a) => (
                            <div key={a.id} className="flex items-center gap-1.5" title={a.name}>
                                <Avatar name={a.name} />
                                <span className="text-xs">{a.name}</span>
                            </div>
                        ))
                    ) : (
                        <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                </div>
            </div>

            {/* Tags */}
            <div>
                <SidebarLabel>Tags</SidebarLabel>
                <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5">
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
                        <span className="text-xs text-muted-foreground">Add a tag...</span>
                    )}
                </div>
            </div>

            {/* Due Date */}
            <div>
                <SidebarLabel>Due Date</SidebarLabel>
                <div className="flex h-9 items-center gap-2 rounded-md border px-3 text-sm">
                    <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
                    {task.due_date ? (
                        <span>
                            {new Date(task.due_date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </span>
                    ) : (
                        <span className="text-muted-foreground">Not set</span>
                    )}
                </div>
            </div>

            {/* Estimate */}
            <div>
                <SidebarLabel>Estimate</SidebarLabel>
                <div className="flex h-9 items-center gap-2 rounded-md border px-3 text-sm">
                    <Clock className="size-4 shrink-0 text-muted-foreground" />
                    {estimateHours ? (
                        <span>{estimateHours}</span>
                    ) : (
                        <span className="text-muted-foreground">Not set</span>
                    )}
                </div>
            </div>

            {/* Time Tracker */}
            <TaskTimeTracker task={task} />

            {/* Previous / Next */}
            <div className="mt-auto flex gap-2 border-t pt-4">
                {previousTask ? (
                    <button
                        onClick={() => router.visit(show(previousTask.id).url)}
                        className="flex flex-1 items-center gap-1.5 rounded-md border px-2 py-2 text-xs hover:bg-muted"
                    >
                        <ChevronLeft className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate text-left">
                            <span className="block text-[10px] text-muted-foreground">Previous Task</span>
                            <span className="truncate font-medium">{previousTask.title}</span>
                        </span>
                    </button>
                ) : (
                    <div className="flex-1" />
                )}
                {nextTask ? (
                    <button
                        onClick={() => router.visit(show(nextTask.id).url)}
                        className="flex flex-1 items-center justify-end gap-1.5 rounded-md border px-2 py-2 text-xs hover:bg-muted"
                    >
                        <span className="truncate text-right">
                            <span className="block text-[10px] text-muted-foreground">Next Task</span>
                            <span className="truncate font-medium">{nextTask.title}</span>
                        </span>
                        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
                    </button>
                ) : (
                    <div className="flex-1" />
                )}
            </div>
        </aside>
    );
}
