import { usePage } from '@inertiajs/react';
import { ShowBoardHeading } from '@/components/boards/show-heading';
import { ShowBoardKanbanView } from '@/components/boards/show-kanban-view';
import { index, show } from '@/routes/boards';
import type { Team } from '@/types';
import type { Board, BoardShowPageProps } from '@/types/board';

export default function ShowBoardPage() {
    const { view } = usePage<BoardShowPageProps>().props;

    return (
        <div className="flex h-full flex-col gap-8 p-8">
            <ShowBoardHeading />

            {view === 'grid' && <ShowBoardKanbanView />}
            {view === 'list' && (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                    List view is not implemented yet.
                </div>
            )}
        </div>
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
