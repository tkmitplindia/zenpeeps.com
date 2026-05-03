import { BoardIndexHeading } from '@/components/boards/index-heading';
import { index } from '@/routes/boards';
import { Team } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function BoardsIndexPage() {
    const { currentTeam } = usePage<{ currentTeam: Team }>().props;

    return (
        <>
            <Head title="Boards" />
            <div className="p-4">
                <BoardIndexHeading currentTeam={currentTeam} />
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
