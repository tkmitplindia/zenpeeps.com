import { Link } from '@inertiajs/react';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVerticalIcon, KanbanIcon, PlusIcon } from 'lucide-react';
import type { BoardColumn, BoardItem } from '@/types/board';
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

export function ShowBoardKanbanColumn({
    column,
    items,
}: {
    column: BoardColumn;
    items: BoardItem[];
}) {
    const currentTeam = useCurrentTeam();
    const createUrl = create({
        current_team: currentTeam.slug,
        board: column.board_id,
    }).url;

    const sortable = useSortable({
        id: column.id,
        data: { type: 'column' },
    });
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = sortable;

    // Droppable for items so cross-column drops land even when the column is
    // empty (no item to hover over).
    const { setNodeRef: setItemDropRef } = useDroppable({
        id: column.id,
        data: { type: 'column-droppable' },
    });

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

            <SortableContext
                items={items.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
            >
                <div
                    ref={setItemDropRef}
                    className="flex min-h-12 flex-col gap-2"
                >
                    {items.map((item) => (
                        <ShowBoardKanbanCard key={item.id} item={item} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
}
