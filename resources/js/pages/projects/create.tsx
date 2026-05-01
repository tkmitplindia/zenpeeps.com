import { Head, setLayoutProps } from '@inertiajs/react';
import { ProjectCreateForm } from '@/components/project/create-form';
import type { Plan } from '@/types';

export default function ProjectsCreate({ plans }: { plans: Plan[] }) {
    setLayoutProps({
        title: 'Create project',
        description: 'Spin up a new workspace for your team.',
    });

    return (
        <>
            <Head title="Create project" />

            <ProjectCreateForm plans={plans} />
        </>
    );
}
