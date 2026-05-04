import { usePage } from '@inertiajs/react';
import { BoardDeleteDialogProvider } from '@/components/boards/board-delete-dialog-provider';
import { ShowBoardHeading } from '@/components/boards/show-heading';
import { ShowBoardKanbanView } from '@/components/boards/show-kanban-view';
import { ShowBoardListView } from '@/components/boards/show-list-view';
import { index, show } from '@/routes/boards';
import type { Team } from '@/types';
import type { Board, BoardShowPageProps } from '@/types/board';

export default function ShowBoardPage() {
    const { view } = usePage<BoardShowPageProps>().props;

    return (
        <BoardDeleteDialogProvider>
            <div className="flex h-full flex-col gap-8 p-8">
                <ShowBoardHeading />

                {view === 'grid' && <ShowBoardKanbanView />}
                {view === 'list' && <ShowBoardListView />}
            </div>
        </BoardDeleteDialogProvider>
    );
}

ShowBoardPage.layout = (props: { currentTeam: Team; board: Board }) => ({
    breadcrumbs: [
        {
            title: 'Boards',
            href: index(props.currentTeam.slug).url,
        },
        {
            title: props.board.name,
            href: show({
                current_team: props.currentTeam.slug,
                board: props.board.id,
            }).url,
        },
    ],
});
