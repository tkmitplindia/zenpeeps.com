import { router, usePage } from '@inertiajs/react';
import {
    ExternalLinkIcon,
    FlagIcon,
    MoveRightIcon,
    TrashIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useBoardItemPatch } from '@/hooks/use-board-item-form';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { show } from '@/routes/boards/items';
import type {
    BoardItem,
    BoardItemPriority,
    BoardShowPageProps,
} from '@/types/board';
import { useBoardItemDialog } from './items/board-item-delete-dialog-provider';

const PRIORITY_OPTIONS: { value: BoardItemPriority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
];

export function BoardItemCardContextMenu({
    item,
    children,
}: {
    item: BoardItem;
    children: ReactNode;
}) {
    const currentTeam = useCurrentTeam();
    const { columns } = usePage<BoardShowPageProps>().props;
    const patch = useBoardItemPatch(item);
    const { confirmDelete } = useBoardItemDialog();

    const open = () =>
        router.visit(
            show({
                current_team: currentTeam.slug,
                board: item.board_id,
                item: item.id,
            }).url,
        );

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent className="w-52">
                <ContextMenuItem onSelect={open}>
                    <ExternalLinkIcon /> Open
                </ContextMenuItem>
                <ContextMenuSub>
                    <ContextMenuSubTrigger>
                        <MoveRightIcon /> Move to column
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                        {columns.map((column) => (
                            <ContextMenuItem
                                key={column.id}
                                disabled={column.id === item.board_column_id}
                                onSelect={() =>
                                    patch({ board_column_id: column.id })
                                }
                            >
                                {column.name}
                            </ContextMenuItem>
                        ))}
                    </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSub>
                    <ContextMenuSubTrigger>
                        <FlagIcon /> Set priority
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                        {PRIORITY_OPTIONS.map((option) => (
                            <ContextMenuItem
                                key={option.value}
                                disabled={option.value === item.priority}
                                onSelect={() =>
                                    patch({ priority: option.value })
                                }
                            >
                                {option.label}
                            </ContextMenuItem>
                        ))}
                    </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSeparator />
                <ContextMenuItem
                    onSelect={() => confirmDelete(item)}
                    className="text-destructive"
                >
                    <TrashIcon className="text-destructive" /> Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}
