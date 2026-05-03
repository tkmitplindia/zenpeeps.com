import { Link } from '@inertiajs/react';
import { KanbanIcon, PlusIcon } from 'lucide-react';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { create } from '@/routes/boards';
import { Button } from '../ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '../ui/empty';

export function BoardsEmpty() {
    const currentTeam = useCurrentTeam();

    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <KanbanIcon className="size-4" />
                </EmptyMedia>
                <EmptyTitle>No boards</EmptyTitle>
                <EmptyDescription>There are no boards yet</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button asChild>
                    <Link href={create({ current_team: currentTeam.slug })}>
                        <PlusIcon /> New Board
                    </Link>
                </Button>
            </EmptyContent>
        </Empty>
    );
}
