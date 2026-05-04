import { MoreVerticalIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBoardItemPatch } from '@/hooks/use-board-item-form';
import type { BoardItem } from '@/types/board';
import { useBoardItemDialog } from './board-item-delete-dialog-provider';

export function ItemFormHeader({ item }: { item: BoardItem }) {
    const patch = useBoardItemPatch(item);
    const { confirmDelete } = useBoardItemDialog();
    const [title, setTitle] = useState(item.title);

    const commit = () => {
        if (title.trim() === '' || title === item.title) {
            return;
        }

        patch({ title: title.trim() });
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
                        onSelect={() => confirmDelete(item)}
                        className="text-destructive"
                    >
                        <Trash2Icon className="mr-2 size-4" /> Delete task
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
