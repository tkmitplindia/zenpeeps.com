import { Head, Link } from '@inertiajs/react';
import { TaskAttachments } from '@/components/task/task-attachments';
import { TaskChecklist } from '@/components/task/task-checklist';
import { TaskDescription } from '@/components/task/task-description';
import { TaskDiscussions } from '@/components/task/task-discussions';
import { TaskSidebar } from '@/components/task/task-sidebar';
import AppLayout from '@/layouts/app-layout';
import { show as showBoard } from '@/routes/boards';
import type { Board, Task, TaskItem } from '@/types';

type Props = {
    task: Task;
    previousTask: Task | null;
    nextTask: Task | null;
};

export default function TaskShow({ task, previousTask, nextTask }: Props) {
    const board = task.board as Board;
    const items = (task.items ?? []) as TaskItem[];

    return (
        <>
            <Head title={task.title} />

            <div className="flex h-full gap-6 p-6">
                {/* Main content */}
                <div className="flex min-w-0 flex-1 flex-col gap-5">
                    {/* Header */}
                    <div>
                        <h1 className="text-xl font-bold leading-tight">{task.title}</h1>
                        <p className="mt-0.5 text-xs text-muted-foreground">TASK #{task.id.slice(0, 8).toUpperCase()}</p>
                    </div>

                    {/* Description */}
                    <TaskDescription task={task} />

                    {/* Checklist */}
                    <TaskChecklist task={task} items={items} />

                    {/* Attachments */}
                    <TaskAttachments />

                    {/* Discussions */}
                    <TaskDiscussions />
                </div>

                {/* Sidebar */}
                <TaskSidebar
                    task={task}
                    board={board}
                    previousTask={previousTask}
                    nextTask={nextTask}
                />
            </div>
        </>
    );
}

TaskShow.layout = (props: Props) => {
    const board = props.task.board as Board;

    return [
        AppLayout,
        {
            breadcrumbs: [
                { title: 'Boards', href: showBoard.url(board?.id ?? '') },
                { title: board?.name ?? 'Board' },
                { title: props.task.title },
            ],
        },
    ];
};
