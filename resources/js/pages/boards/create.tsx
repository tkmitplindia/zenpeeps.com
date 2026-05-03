import { Head } from '@inertiajs/react';

import { index } from '@/routes/boards';
import type { Team } from '@/types';
import Heading from '@/components/heading';

import { CreateBoardForm } from '@/components/boards/create-form';

export default function CreateBoardPage() {
    return (
        <div className="p-4">
            <Head title="Create Board" />

            <div className="space-y-6">
                <Heading
                    title="New Board"
                    description="Set up a new board with columns and team members."
                />

                <div className="max-w-xl">
                    <CreateBoardForm />
                </div>
            </div>
        </div>
    );
}

CreateBoardPage.layout = (props: { currentTeam: Team }) => ({
    breadcrumbs: [
        {
            title: 'Boards',
            href: index(props.currentTeam.slug).url,
        },
        {
            title: 'Create',
            href: '#',
        },
    ],
});
