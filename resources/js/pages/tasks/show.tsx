import { Head } from '@inertiajs/react';
import { TaskEditForm } from '@/components/task/task-edit-form';
import AppLayout from '@/layouts/app-layout';
import { show as showBoard } from '@/routes/boards';
import type { Board, Task } from '@/types';

type Props = {
    task: Task;
    previousTask: Task | null;
    nextTask: Task | null;
};

export default function TaskShow({ task, previousTask, nextTask }: Props) {
    return (
        <>
            <Head title={task.title} />
            <TaskEditForm task={task} previousTask={previousTask} nextTask={nextTask} />
        </>
    );
}

TaskShow.layout = (props: Props) => {
    const board = props.task?.board as Board | undefined;
    return [
        AppLayout,
        {
            breadcrumbs: [
                { title: 'Boards', href: showBoard.url(board?.id ?? '') },
                { title: board?.name ?? 'Board', href: showBoard.url(board?.id ?? '') },
                { title: props.task?.title ?? 'Task' },
            ],
        },
    ];
};
