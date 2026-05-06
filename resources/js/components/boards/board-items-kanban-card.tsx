import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from '@inertiajs/react';
import { CalendarIcon, FlagIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { useInitials } from '@/hooks/use-initials';
import { show } from '@/routes/boards/items';
import type { BoardItem, BoardItemPriority } from '@/types/board';
import { BoardItemCardContextMenu } from './board-item-card-context-menu';

const PRIORITY_LABEL: Record<BoardItemPriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
};

const PRIORITY_CLASS: Record<BoardItemPriority, string> = {
    low: 'text-muted-foreground',
    medium: 'text-blue-600',
    high: 'text-orange-600',
    urgent: 'text-red-600',
};

export function BoardItemsKanbanCard({
    item,
    overlay = false,
}: {
    item: BoardItem;
    overlay?: boolean;
}) {
    const currentTeam = useCurrentTeam();
    const initials = useInitials();
    const tags = item.tags ?? [];
    const assignees = item.assignees ?? [];

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: item.id,
        data: { type: 'item' },
        disabled: overlay,
    });

    return (
        <BoardItemCardContextMenu item={item}>
            <Link
                ref={overlay ? undefined : setNodeRef}
                href={
                    show({
                        current_team: currentTeam.slug,
                        board: item.board_id,
                        item: item.id,
                    }).url
                }
                draggable={false}
                style={
                    overlay
                        ? { cursor: 'grabbing' }
                        : {
                              transform: CSS.Transform.toString(transform),
                              transition,
                              opacity: isDragging ? 0 : 1,
                          }
                }
                className="flex touch-none flex-col gap-2 rounded-lg border bg-card p-3 text-left shadow-sm transition-colors hover:bg-accent active:cursor-grabbing"
                {...(overlay ? {} : attributes)}
                {...(overlay ? {} : listeners)}
            >
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <h4 className="text-sm leading-snug font-medium">
                            {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                            Task #{item.number}
                        </p>
                    </div>
                    <span
                        className={`flex items-center gap-1 text-xs ${PRIORITY_CLASS[item.priority]}`}
                    >
                        <FlagIcon className="size-3" />
                        {PRIORITY_LABEL[item.priority]}
                    </span>
                </div>

                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {tags.map((t) => (
                            <span
                                key={t.id}
                                className="rounded bg-secondary px-1.5 py-0.5 text-xs"
                            >
                                {t.name}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    {item.due_date ? (
                        <span className="flex items-center gap-1">
                            <CalendarIcon className="size-3" />
                            {new Date(item.due_date).toLocaleDateString(
                                undefined,
                                {
                                    month: 'short',
                                    day: 'numeric',
                                },
                            )}
                        </span>
                    ) : (
                        <span />
                    )}
                    <div className="flex -space-x-2">
                        {assignees.slice(0, 3).map((u) => (
                            <Avatar
                                key={u.id}
                                className="size-6 border-2 border-card"
                            >
                                <AvatarImage src={u.avatar} alt={u.name} />
                                <AvatarFallback className="text-[10px]">
                                    {initials(u.name)}
                                </AvatarFallback>
                            </Avatar>
                        ))}
                        {assignees.length > 3 && (
                            <span className="flex size-6 items-center justify-center rounded-full border-2 border-card bg-secondary text-[10px]">
                                +{assignees.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </BoardItemCardContextMenu>
    );
}
