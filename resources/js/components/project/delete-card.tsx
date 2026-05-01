import { Form } from '@inertiajs/react';
import ProjectController from '@/actions/App/Http/Controllers/ProjectController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { Project } from '@/types';

export function ProjectDeleteCard({ project }: { project: Project }) {
    return (
        <section className="space-y-6">
            <Heading
                variant="small"
                title="Delete project"
                description="Delete this project and all of its resources"
            />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">Warning</p>
                    <p className="text-sm">
                        Please proceed with caution, this cannot be undone.
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive">Delete project</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>
                            Are you sure you want to delete {project.name}?
                        </DialogTitle>
                        <DialogDescription>
                            Once this project is deleted, all of its boards,
                            tasks, pages, and meetings will be permanently
                            deleted.
                        </DialogDescription>

                        <Form {...ProjectController.destroy.form(project.id)}>
                            {({ processing }) => (
                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button variant="secondary">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        variant="destructive"
                                        disabled={processing}
                                        asChild
                                    >
                                        <button type="submit">
                                            Delete project
                                        </button>
                                    </Button>
                                </DialogFooter>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
}
