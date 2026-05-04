import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from '@inertiajs/react';
import { GripVerticalIcon, PlusIcon } from 'lucide-react';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { create } from '@/routes/boards/items';
import type { BoardColumn, BoardItem } from '@/types/board';
import { Button } from '../ui/button';
import { ShowBoardListRow } from './show-list-row';

export function ShowBoardListSection({
    column,
    items,
    overlay = false,
}: {
    column: BoardColumn;
    items: BoardItem[];
    overlay?: boolean;
}) {
    const currentTeam = useCurrentTeam();
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
    } = useSortable({
        id: column.id,
        data: { type: 'column' },
        disabled: overlay,
    });

    // Droppable for items so cross-section drops land even when the section is
    // empty. Uses a distinct id from the sortable section so collision
    // detection can resolve them independently.
    const { setNodeRef: setItemDropRef } = useDroppable({
        id: `${column.id}:items`,
        data: { type: 'column-droppable', columnId: column.id },
        disabled: overlay,
    });

    return (
        <section
            ref={overlay ? undefined : setNodeRef}
            style={
                overlay
                    ? undefined
                    : {
                          transform: CSS.Transform.toString(transform),
                          transition,
                          opacity: isDragging ? 0 : 1,
                      }
            }
            className="flex flex-col gap-3"
        >
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        {column.name}
                    </h3>
                    <span className="flex size-5 items-center justify-center rounded-full bg-secondary text-[10px] font-medium text-muted-foreground">
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
            </header>

            {overlay ? (
                <div className="flex min-h-12 flex-col gap-2">
                    {items.map((item) => (
                        <ShowBoardListRow key={item.id} item={item} overlay />
                    ))}
                </div>
            ) : (
                <SortableContext
                    items={items.map((i) => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div
                        ref={setItemDropRef}
                        className="flex min-h-12 flex-col gap-2"
                    >
                        {items.map((item) => (
                            <ShowBoardListRow key={item.id} item={item} />
                        ))}
                    </div>
                </SortableContext>
            )}
        </section>
    );
}
