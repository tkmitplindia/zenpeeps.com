import { DndContext, DragOverlay } from '@dnd-kit/core';
import {
    SortableContext,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Link, usePage } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { useId } from 'react';
import { useBoardDnd } from '@/hooks/use-board-dnd';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { create as createColumn } from '@/routes/boards/columns';
import type { BoardItemsIndexPageProps } from '@/types/board';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { BoardItemsKanbanCard } from './board-items-kanban-card';
import { BoardItemsKanbanColumn } from './board-items-kanban-column';

export function BoardItemsKanbanView() {
    const { board } = usePage<BoardItemsIndexPageProps>().props;
    const currentTeam = useCurrentTeam();
    const dnd = useBoardDnd();
    const dndId = useId();

    return (
        <DndContext
            id={dndId}
            sensors={dnd.sensors}
            collisionDetection={dnd.collisionDetection}
            onDragStart={dnd.onDragStart}
            onDragOver={dnd.onDragOver}
            onDragEnd={dnd.onDragEnd}
            onDragCancel={dnd.onDragCancel}
        >
            <SortableContext
                items={dnd.local.map((c) => c.id)}
                strategy={horizontalListSortingStrategy}
            >
                <ScrollArea orientation="horizontal" className="min-h-0 flex-1">
                    <div className="flex gap-6 pb-4">
                        {dnd.local.map((c) => (
                            <BoardItemsKanbanColumn
                                key={c.id}
                                column={c.column}
                                items={c.items}
                            />
                        ))}

                        <Button
                            variant="secondary"
                            size="lg"
                            className="w-80"
                            asChild
                        >
                            <Link
                                href={
                                    createColumn({
                                        current_team: currentTeam.slug,
                                        board: board.id,
                                    }).url
                                }
                            >
                                <PlusIcon />
                                Add another column
                            </Link>
                        </Button>
                    </div>
                </ScrollArea>
            </SortableContext>

            <DragOverlay dropAnimation={null}>
                {dnd.activeItem ? (
                    <BoardItemsKanbanCard item={dnd.activeItem} overlay />
                ) : dnd.activeColumn ? (
                    <BoardItemsKanbanColumn
                        column={dnd.activeColumn.column}
                        items={dnd.activeColumn.items}
                        overlay
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
