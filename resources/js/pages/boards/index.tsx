import { Head, usePage } from '@inertiajs/react';
import { BoardsEmpty } from '@/components/boards/index-empty';
import { IndexGridView } from '@/components/boards/index-grid-view';
import { BoardIndexHeading } from '@/components/boards/index-heading';
import { IndexListView } from '@/components/boards/index-list-view';
import { index } from '@/routes/boards';
import type { Team } from '@/types';
import type { BoardIndexPageProps } from '@/types/board';

export default function BoardsIndexPage() {
    const { view, boards } = usePage<BoardIndexPageProps>().props;

    function renderBoardsView() {
        if (boards.total === 0) {
            return <BoardsEmpty />;
        }

        if (view === 'grid') {
            return <IndexGridView />;
        }

        return <IndexListView />;
    }

    return (
        <>
            <Head title="Boards" />
            <div className="space-y-4 p-4">
                <BoardIndexHeading />
                {renderBoardsView()}
            </div>
        </>
    );
}

BoardsIndexPage.layout = (props: { currentTeam: Team }) => ({
    breadcrumbs: [
        {
            title: 'Boards',
            href: index(props.currentTeam.slug).url,
        },
    ],
});
