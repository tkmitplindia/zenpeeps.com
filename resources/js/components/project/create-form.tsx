import { Form, Link } from '@inertiajs/react';
import ProjectController from '@/actions/App/Http/Controllers/ProjectController';
import InputError from '@/components/input-error';
import { ProjectPlanSelect } from '@/components/project/project-plan-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { index as projectsIndex } from '@/routes/projects';
import type { Plan } from '@/types';

export function ProjectCreateForm({ plans }: { plans: Plan[] }) {
    return (
        <Form
            {...ProjectController.store.form()}
            options={{ preserveScroll: true }}
            className="mx-auto w-full max-w-md space-y-6"
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            autoFocus
                            autoComplete="off"
                            placeholder="Aperture Science"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-1 focus-visible:outline-ring"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <ProjectPlanSelect
                        plans={plans}
                        defaultValue="spark"
                        error={errors.plan}
                    />

                    <div className="flex flex-col gap-3">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full"
                        >
                            {processing && <Spinner />}
                            Create project
                        </Button>
                        <Button
                            asChild
                            variant="link"
                            className="text-muted-foreground"
                        >
                            <Link href={projectsIndex()}>
                                Back to your projects
                            </Link>
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
