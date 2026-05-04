import { Head } from '@inertiajs/react';
import { EditBoardForm } from '@/components/boards/edit-form';
import Heading from '@/components/heading';
import { edit, index, show } from '@/routes/boards';
import type { Team } from '@/types';
import type { Board } from '@/types/board';

export default function EditBoardPage() {
    return (
        <div className="p-4">
            <Head title="Edit Board" />

            <div className="space-y-6">
                <Heading
                    title="Edit Board"
                    description="Update the name, description, status, and members of this board."
                />

                <div className="max-w-xl">
                    <EditBoardForm />
                </div>
            </div>
        </div>
    );
}

EditBoardPage.layout = (props: { currentTeam: Team; board: Board }) => ({
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
        {
            title: 'Edit',
            href: edit({
                current_team: props.currentTeam.slug,
                board: props.board.id,
            }).url,
        },
    ],
});
