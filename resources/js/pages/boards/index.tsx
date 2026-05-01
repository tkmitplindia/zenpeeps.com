import { Head } from '@inertiajs/react';
import { BoardCard } from '@/components/boards/board-card';
import { BoardsEmpty } from '@/components/boards/boards-empty';
import { BoardsIndexHeader } from '@/components/boards/index-header';
import { Fallback } from '@/components/fallback';
import { index } from '@/routes/boards';
import type { Board, Paginator } from '@/types';

export default function BoardsIndex({ boards }: { boards: Paginator<Board> }) {
    return (
        <>
            <Head title="Boards" />

            <Fallback condition={boards.total} fallback={BoardsEmpty}>
                <div className="flex h-full flex-col gap-6 p-6">
                    <BoardsIndexHeader
                        boardCount={boards.total}
                        totalTasks={boards.data.reduce(
                            (sum, b) => sum + (b.tasks_count ?? 0),
                            0,
                        )}
                    />

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {boards.data.map((board) => (
                            <BoardCard key={board.id} board={board} />
                        ))}
                    </div>
                </div>
            </Fallback>
        </>
    );
}

BoardsIndex.layout = {
    breadcrumbs: [{ title: 'Boards', href: index.url() }],
};
