import { Link } from '@inertiajs/react';
import { Kanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { create } from '@/routes/boards';

export function BoardsEmpty() {
    return (
        <Empty className="flex-1">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Kanban />
                </EmptyMedia>
                <EmptyTitle>No boards yet</EmptyTitle>
                <EmptyDescription>
                    Create a board to start tracking work for your team.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button asChild>
                    <Link href={create.url()}>Create your first board</Link>
                </Button>
            </EmptyContent>
        </Empty>
    );
}
