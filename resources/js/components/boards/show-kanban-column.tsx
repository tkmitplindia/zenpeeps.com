import { Link } from '@inertiajs/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVerticalIcon, KanbanIcon, PlusIcon } from 'lucide-react';
import type { BoardColumn } from '@/types/board';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { create } from '@/routes/boards/items';
import { Button } from '../ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '../ui/empty';
import { ShowBoardKanbanCard } from './show-kanban-card';

export function ShowBoardKanbanColumn({ column }: { column: BoardColumn }) {
    const currentTeam = useCurrentTeam();
    const items = column.items ?? [];
    const createUrl = create({
        current_team: currentTeam.slug,
        board: column.board_id,
    }).url;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: column.id });

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.6 : 1,
            }}
            className="flex w-80 shrink-0 flex-col gap-4 rounded-xl bg-sidebar p-4"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                        {column.name}
                    </h3>
                    <span className="flex size-6 items-center justify-center rounded-full bg-secondary text-xs font-medium text-muted-foreground">
                        {items.length}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 cursor-grab touch-none active:cursor-grabbing"
                        aria-label={`Reorder ${column.name}`}
                        {...attributes}
                        {...listeners}
                    >
                        <GripVerticalIcon className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        asChild
                    >
                        <Link href={createUrl}>
                            <PlusIcon className="size-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            {items.length === 0 ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia>
                            <KanbanIcon />
                        </EmptyMedia>
                        <EmptyTitle>No items yet</EmptyTitle>
                        <EmptyDescription>
                            Add items to this column to get started
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button variant="secondary" asChild>
                            <Link href={createUrl}>
                                <PlusIcon />
                                Add item
                            </Link>
                        </Button>
                    </EmptyContent>
                </Empty>
            ) : (
                <div className="flex flex-col gap-2">
                    {items.map((item) => (
                        <ShowBoardKanbanCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
}
