import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BoardHeader } from '@/components/boards/board-header';
import { KanbanBoard } from '@/components/boards/kanban-board';
import { index } from '@/routes/boards';
import type { Board } from '@/types';

export default function BoardShow({ board }: { board: Board }) {
    return (
        <>
            <Head title={board.name} />

            <div className="flex h-full flex-col gap-5 p-6">
                <BoardHeader board={board} />
                <KanbanBoard board={board} />
            </div>
        </>
    );
}

BoardShow.layout = (props: { board: Board }) => [
    AppLayout,
    {
        breadcrumbs: [
            { title: 'Boards', href: index.url() },
            { title: props.board.name },
        ],
    },
];
