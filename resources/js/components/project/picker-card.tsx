import { Form } from '@inertiajs/react';
import ProjectController from '@/actions/App/Http/Controllers/ProjectController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Project } from '@/types';

const projectInitial = (name: string): string =>
    (name.trim().charAt(0) || '?').toUpperCase();

export function ProjectPickerCard({ project }: { project: Project }) {
    return (
        <Form
            {...ProjectController.select.form(project.id)}
            options={{ preserveScroll: false }}
        >
            {({ processing }) => (
                <Button
                    type="submit"
                    variant="ghost"
                    disabled={processing}
                    className="h-auto w-full cursor-pointer justify-start gap-4 p-4 text-left"
                >
                    <div className="flex aspect-square size-10 items-center justify-center rounded-md bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
                        {projectInitial(project.name)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                            <span className="truncate font-medium">
                                {project.name}
                            </span>
                            <Badge variant="secondary" className="uppercase">
                                {project.plan}
                            </Badge>
                        </div>
                        {project.description && (
                            <p className="truncate text-sm font-normal text-muted-foreground">
                                {project.description}
                            </p>
                        )}
                    </div>
                </Button>
            )}
        </Form>
    );
}
