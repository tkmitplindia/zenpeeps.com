import { Head } from '@inertiajs/react';
import { BoardDeleteDialog } from '@/components/boards/board-delete-dialog';
import { EditBoardForm } from '@/components/boards/edit-board-form';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { index, show } from '@/routes/boards';
import type { Board } from '@/types';

export default function BoardEdit({ board }: { board: Board }) {
    return (
        <>
            <Head title={`Edit · ${board.name}`} />

            <div className="max-w-2xl p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">{board.name}</h1>
                        {board.description && (
                            <p className="text-sm text-muted-foreground">
                                {board.description}
                            </p>
                        )}
                    </div>
                    <BoardDeleteDialog board={board}>
                        <Button variant="destructive" size="sm" type="button">
                            Delete
                        </Button>
                    </BoardDeleteDialog>
                </div>

                <EditBoardForm board={board} />
            </div>
        </>
    );
}

BoardEdit.layout = (props: { board: Board }) => [
    AppLayout,
    {
        breadcrumbs: [
            { title: 'Boards', href: index.url() },
            { title: props.board.name, href: show.url(props.board.id as any) },
            { title: 'Edit' },
        ],
    },
];
