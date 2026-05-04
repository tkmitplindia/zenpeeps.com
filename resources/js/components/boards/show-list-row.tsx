import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from '@inertiajs/react';
import {
    CalendarIcon,
    FlagIcon,
    MessageSquareIcon,
    PaperclipIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { useInitials } from '@/hooks/use-initials';
import { show } from '@/routes/boards/items';
import type { BoardItem, BoardItemPriority } from '@/types/board';

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

export function ShowBoardListRow({
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
    const attachmentsCount = item.attachments?.length ?? 0;
    const commentsCount = item.comments?.length ?? 0;
    const primaryAssignee = assignees[0];

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
            className="flex touch-none items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3 text-left shadow-sm transition-colors hover:bg-accent active:cursor-grabbing"
            {...(overlay ? {} : attributes)}
            {...(overlay ? {} : listeners)}
        >
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h4 className="truncate text-sm leading-snug font-semibold">
                    {item.title}
                </h4>
                {tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        {tags.map((t) => (
                            <span
                                key={t.id}
                                className="text-xs text-muted-foreground"
                            >
                                # {t.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex shrink-0 items-center gap-4 text-xs text-muted-foreground">
                <span
                    className={`flex items-center gap-1 ${PRIORITY_CLASS[item.priority]}`}
                >
                    <FlagIcon className="size-3" />
                    {PRIORITY_LABEL[item.priority]}
                </span>
                {item.due_date && (
                    <span className="flex items-center gap-1">
                        <CalendarIcon className="size-3" />
                        {new Date(item.due_date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                )}
                {attachmentsCount > 0 && (
                    <span className="flex items-center gap-1">
                        <PaperclipIcon className="size-3" />
                        {attachmentsCount}
                    </span>
                )}
                {commentsCount > 0 && (
                    <span className="flex items-center gap-1">
                        <MessageSquareIcon className="size-3" />
                        {commentsCount}
                    </span>
                )}
                {primaryAssignee && (
                    <span className="flex items-center gap-1.5">
                        <Avatar className="size-5">
                            <AvatarImage
                                src={primaryAssignee.avatar}
                                alt={primaryAssignee.name}
                            />
                            <AvatarFallback className="text-[9px]">
                                {initials(primaryAssignee.name)}
                            </AvatarFallback>
                        </Avatar>
                        {primaryAssignee.name}
                    </span>
                )}
            </div>
        </Link>
    );
}
