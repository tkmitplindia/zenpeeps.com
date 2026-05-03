import { Head, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import { CreateBoardColumnForm } from '@/components/boards/columns/create-form';
import { index, show as showBoard } from '@/routes/boards';
import type { Team } from '@/types';
import type { Board, BoardColumnCreatePageProps } from '@/types/board';

export default function CreateBoardColumnPage() {
    const { board } = usePage<BoardColumnCreatePageProps>().props;

    return (
        <div className="p-4">
            <Head title={`New column – ${board.name}`} />

            <div className="space-y-6">
                <Heading
                    title="New Column"
                    description="Add a column to organize tasks on this board."
                />

                <div className="max-w-md">
                    <CreateBoardColumnForm />
                </div>
            </div>
        </div>
    );
}

CreateBoardColumnPage.layout = (props: {
    currentTeam: Team;
    board: Board;
}) => ({
    breadcrumbs: [
        {
            title: 'Boards',
            href: index(props.currentTeam.slug).url,
        },
        {
            title: props.board.name,
            href: showBoard({
                current_team: props.currentTeam.slug,
                board: props.board.id,
            }).url,
        },
        {
            title: 'New Column',
            href: '#',
        },
    ],
});
