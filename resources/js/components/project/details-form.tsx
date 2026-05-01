import { Form } from '@inertiajs/react';
import ProjectController from '@/actions/App/Http/Controllers/ProjectController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import type { Project } from '@/types';

export function ProjectDetailsForm({ project }: { project: Project }) {
    return (
        <section className="space-y-6">
            <Heading
                variant="small"
                title="Project details"
                description="Rename the project or update its description."
            />

            <Form
                {...ProjectController.update.form(project.id)}
                options={{ preserveScroll: true }}
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                defaultValue={project.name}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                defaultValue={project.description ?? ''}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-1 focus-visible:outline-ring"
                            />
                            <InputError message={errors.description} />
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner />}
                            Save changes
                        </Button>
                    </>
                )}
            </Form>
        </section>
    );
}
