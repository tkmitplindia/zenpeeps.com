import { Head } from '@inertiajs/react';
import { TaskCreateForm } from '@/components/task/task-create-form';
import AppLayout from '@/layouts/app-layout';
import { index as boardsIndex, show as boardShow } from '@/routes/boards';
import type { Board, BoardColumn } from '@/types';
import type { User } from '@/types/auth';

type Props = {
    board: Board & { columns: BoardColumn[] };
    selectedColumnId: string;
    members: User[];
};

export default function TaskCreate({
    board,
    selectedColumnId,
    members,
}: Props) {
    return (
        <>
            <Head title="New Task" />
            <TaskCreateForm
                board={board}
                selectedColumnId={selectedColumnId}
                members={members}
            />
        </>
    );
}

TaskCreate.layout = (props: { board: Board }) => [
    AppLayout,
    {
        breadcrumbs: [
            { title: 'Boards', href: boardsIndex.url() },
            {
                title: props.board?.name ?? 'Board',
                href: boardShow.url({ board: props.board?.id ?? '' }),
            },
            { title: 'New Task' },
        ],
    },
];
