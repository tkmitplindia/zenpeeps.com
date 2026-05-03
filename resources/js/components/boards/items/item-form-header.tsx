import { useState } from 'react';
import { router } from '@inertiajs/react';
import { MoreVerticalIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBoardItemPatch } from '@/hooks/use-board-item-form';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { destroy } from '@/routes/boards/items';
import type { BoardItem } from '@/types/board';

export function ItemFormHeader({ item }: { item: BoardItem }) {
    const patch = useBoardItemPatch(item);
    const currentTeam = useCurrentTeam();
    const [title, setTitle] = useState(item.title);

    const commit = () => {
        if (title.trim() === '' || title === item.title) {
            return;
        }
        patch({ title: title.trim() });
    };

    const onDelete = () => {
        if (!confirm('Delete this task?')) {
            return;
        }
        router.delete(
            destroy({
                current_team: currentTeam.slug,
                board: item.board_id,
                item: item.id,
            }).url,
        );
    };

    return (
        <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
                <input
                    aria-label="Task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={commit}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.currentTarget.blur();
                        }
                    }}
                    className="w-full bg-transparent text-2xl font-semibold tracking-tight outline-none focus:ring-0"
                />
                <p className="mt-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    Task #{item.number}
                </p>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVerticalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onSelect={onDelete}
                        className="text-destructive"
                    >
                        <Trash2Icon className="mr-2 size-4" /> Delete task
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
