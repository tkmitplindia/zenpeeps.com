import { KanbanIcon, PlusIcon } from 'lucide-react';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '../ui/empty';
import { Button } from '../ui/button';
import { Link } from '@inertiajs/react';
import { create } from '@/routes/boards';
import { useCurrentTeam } from '@/hooks/use-current-team';

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
