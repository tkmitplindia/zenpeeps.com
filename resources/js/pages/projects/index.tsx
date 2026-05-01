import { Head, Link, setLayoutProps } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { ProjectEmptyState } from '@/components/project/empty-state';
import { ProjectPickerCard } from '@/components/project/picker-card';
import { Button } from '@/components/ui/button';
import { create } from '@/routes/projects';
import type { Project } from '@/types';

export default function ProjectsIndex({ projects }: { projects: Project[] }) {
    setLayoutProps({
        title: 'Pick a project',
        description:
            projects.length > 0
                ? 'Choose which project to work in.'
                : "Let's create your first project to get started.",
    });

    return (
        <>
            <Head title="Projects" />

            {projects.length === 0 ? (
                <ProjectEmptyState />
            ) : (
                <div className="mx-auto w-full max-w-2xl space-y-3">
                    <ul className="divide-y rounded-md border">
                        {projects.map((project) => (
                            <li key={project.id}>
                                <ProjectPickerCard project={project} />
                            </li>
                        ))}
                    </ul>

                    <Button
                        asChild
                        variant="ghost"
                        className="h-auto w-full text-muted-foreground"
                    >
                        <Link href={create()}>
                            <Plus />
                            Create new project
                        </Link>
                    </Button>
                </div>
            )}
        </>
    );
}
