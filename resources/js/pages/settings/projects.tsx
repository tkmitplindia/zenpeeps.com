import { Head, setLayoutProps } from '@inertiajs/react';
import { ProjectDeleteCard } from '@/components/project/delete-card';
import { ProjectDetailsForm } from '@/components/project/details-form';
import { ProjectMembers } from '@/components/project/members';
import { Separator } from '@/components/ui/separator';
import { show } from '@/routes/projects';
import type { Project, ProjectMember, ProjectRole, User } from '@/types';

export default function ProjectsSettings({
    project,
    members,
    roles,
}: {
    project: Project & { owner: User };
    members: ProjectMember[];
    roles: ProjectRole[];
}) {
    setLayoutProps({
        breadcrumbs: [{ title: project.name, href: show(project.id) }],
    });

    return (
        <>
            <Head title={`${project.name} · Project settings`} />

            <div className="space-y-12">
                <ProjectDetailsForm project={project} />
                <Separator />
                <ProjectMembers
                    project={project}
                    members={members}
                    roles={roles}
                />
                <Separator />
                <ProjectDeleteCard project={project} />
            </div>
        </>
    );
}
