import { DndContext, DragOverlay } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Link, usePage } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { useId } from 'react';
import { useBoardDnd } from '@/hooks/use-board-dnd';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { create as createColumn } from '@/routes/boards/columns';
import type { BoardShowPageProps } from '@/types/board';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { ShowBoardListRow } from './show-list-row';
import { ShowBoardListSection } from './show-list-section';

export function ShowBoardListView() {
    const { board } = usePage<BoardShowPageProps>().props;
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
                strategy={verticalListSortingStrategy}
            >
                <ScrollArea className="min-h-0 flex-1">
                    <div className="flex flex-col gap-8 pr-4 pb-4">
                        {dnd.local.map((c) => (
                            <ShowBoardListSection
                                key={c.id}
                                column={c.column}
                                items={c.items}
                            />
                        ))}

                        <Button variant="secondary" asChild>
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
                    <ShowBoardListRow item={dnd.activeItem} overlay />
                ) : dnd.activeColumn ? (
                    <ShowBoardListSection
                        column={dnd.activeColumn.column}
                        items={dnd.activeColumn.items}
                        overlay
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
