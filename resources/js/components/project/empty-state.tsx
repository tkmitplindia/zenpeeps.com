import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { create } from '@/routes/projects';

export function ProjectEmptyState() {
    return (
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 p-8 text-center">
            <p className="text-sm text-muted-foreground">
                You don't have any projects yet. Create one to start
                collaborating with your team.
            </p>
            <Button asChild className="w-full">
                <Link href={create()}>
                    <Plus />
                    Create your first project
                </Link>
            </Button>
        </div>
    );
}
