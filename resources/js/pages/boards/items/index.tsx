import { usePage } from '@inertiajs/react';
import { BoardDeleteDialogProvider } from '@/components/boards/board-delete-dialog-provider';
import { BoardItemDeleteDialogProvider } from '@/components/boards/items/board-item-delete-dialog-provider';
import { BoardItemsHeading } from '@/components/boards/board-items-heading';
import { BoardItemsKanbanView } from '@/components/boards/board-items-kanban-view';
import { BoardItemsListView } from '@/components/boards/board-items-list-view';
import { index } from '@/routes/boards';
import type { Team } from '@/types';
import type { Board, BoardItemsIndexPageProps } from '@/types/board';

export default function BoardItemsIndexPage() {
    const { board, view } = usePage<BoardItemsIndexPageProps>().props;

    return (
        <BoardDeleteDialogProvider>
            <BoardItemDeleteDialogProvider>
                <div className="flex h-full flex-col gap-8 p-8">
                    <BoardItemsHeading />

                    {view === 'grid' && <BoardItemsKanbanView />}
                    {view === 'list' && <BoardItemsListView />}
                </div>
            </BoardItemDeleteDialogProvider>
        </BoardDeleteDialogProvider>
    );
}

BoardItemsIndexPage.layout = (props: { currentTeam: Team; board: Board }) => ({
    breadcrumbs: [
        {
            title: 'Boards',
            href: index(props.currentTeam.slug).url,
        },
        {
            title: props.board.name,
            href: index({
                current_team: props.currentTeam.slug,
            }).url,
        },
    ],
});
