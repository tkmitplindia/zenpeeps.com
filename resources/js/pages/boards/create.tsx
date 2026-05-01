import { Head } from '@inertiajs/react';
import { CreateBoardForm } from '@/components/boards/create-board-form';
import { create, index } from '@/routes/boards';
import type { BoardTemplate } from '@/types';

export default function BoardCreate({
    templates,
}: {
    templates: BoardTemplate[];
}) {
    return (
        <>
            <Head title="New Board" />

            <div className="max-w-2xl p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">New Board</h1>
                    <p className="text-sm text-muted-foreground">
                        Create a new board
                    </p>
                </div>

                <CreateBoardForm templates={templates} />
            </div>
        </>
    );
}

BoardCreate.layout = {
    breadcrumbs: [
        { title: 'Boards', href: index.url() },
        { title: 'New Board', href: create.url() },
    ],
};
