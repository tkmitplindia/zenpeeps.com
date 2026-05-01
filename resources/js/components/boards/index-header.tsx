import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { create } from '@/routes/boards';

type Props = {
    boardCount: number;
    totalTasks: number;
};

export function BoardsIndexHeader({ boardCount, totalTasks }: Props) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">Boards</h1>
                <p className="text-sm text-muted-foreground">
                    {boardCount} active {boardCount === 1 ? 'board' : 'boards'}
                    {totalTasks > 0 && ` · ${totalTasks} tasks`}
                </p>
            </div>
            <Button asChild>
                <Link href={create.url()}>
                    <Plus className="size-4" />
                    New Board
                </Link>
            </Button>
        </div>
    );
}
