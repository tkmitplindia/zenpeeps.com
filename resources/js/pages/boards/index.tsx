import { BoardIndexHeading } from '@/components/boards/index-heading';
import { IndexGridView } from '@/components/boards/index-grid-view';
import { IndexListView } from '@/components/boards/index-list-view';
import { index } from '@/routes/boards';
import { Team } from '@/types';
import { BoardIndexPageProps } from '@/types/board';
import { Head, usePage } from '@inertiajs/react';
import { BoardsEmpty } from '@/components/boards/index-empty';

export default function BoardsIndexPage() {
    const { view, boards } = usePage<BoardIndexPageProps>().props;

    function BoardsView() {
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
                <BoardsView />
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
