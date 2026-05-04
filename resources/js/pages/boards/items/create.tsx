import { Head, usePage } from '@inertiajs/react';
import { CreateBoardItemForm } from '@/components/boards/items/create-form';
import Heading from '@/components/heading';
import { index, show as showBoard } from '@/routes/boards';
import type { Team } from '@/types';
import type { Board, BoardItemCreatePageProps } from '@/types/board';

export default function CreateBoardItemPage() {
    const { board } = usePage<BoardItemCreatePageProps>().props;

    return (
        <div className="p-4">
            <Head title={`New task – ${board.name}`} />

            <div className="space-y-6">
                <Heading
                    title="New Task"
                    description="Add a task to this board."
                />

                <div className="max-w-xl">
                    <CreateBoardItemForm />
                </div>
            </div>
        </div>
    );
}

CreateBoardItemPage.layout = (props: { currentTeam: Team; board: Board }) => ({
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
            title: 'New Task',
            href: '#',
        },
    ],
});
