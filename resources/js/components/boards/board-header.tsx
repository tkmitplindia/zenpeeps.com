import { Link } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { BoardDeleteDialog } from '@/components/boards/board-delete-dialog';
import { Button } from '@/components/ui/button';
import { edit } from '@/routes/boards';
import type { Board } from '@/types';

type Props = {
    board: Board;
};

export function BoardHeader({ board }: Props) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold">{board.name}</h1>
                {board.description && (
                    <p className="mt-0.5 text-sm text-muted-foreground">{board.description}</p>
                )}
            </div>
            <div className="flex shrink-0 items-center gap-1">
                <Button variant="ghost" size="icon" className="size-8" asChild>
                    <Link href={edit.url(board.id as any)}>
                        <Pencil className="size-4" />
                    </Link>
                </Button>
                <BoardDeleteDialog board={board}>
                    <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive">
                        <Trash2 className="size-4" />
                    </Button>
                </BoardDeleteDialog>
            </div>
        </div>
    );
}
