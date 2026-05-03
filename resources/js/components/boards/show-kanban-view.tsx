import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
    DndContext,
    type DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { PlusIcon } from 'lucide-react';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { reorder } from '@/routes/boards/columns';
import type { BoardShowPageProps } from '@/types/board';
import { Button } from '../ui/button';
import { ShowBoardKanbanColumn } from './show-kanban-column';

export function ShowBoardKanbanView() {
    const { columns, board } = usePage<BoardShowPageProps>().props;
    const currentTeam = useCurrentTeam();

    // Local order so the UI updates instantly while the request is in flight.
    // Server is the source of truth — sync when fresh props arrive.
    const [orderedIds, setOrderedIds] = useState(() =>
        columns.map((c) => c.id),
    );
    useEffect(() => {
        setOrderedIds(columns.map((c) => c.id));
    }, [columns]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    );

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id) {
            return;
        }
        const from = orderedIds.indexOf(active.id as string);
        const to = orderedIds.indexOf(over.id as string);
        if (from === -1 || to === -1) {
            return;
        }
        const next = arrayMove(orderedIds, from, to);
        setOrderedIds(next);

        router.patch(
            reorder({ current_team: currentTeam.slug, board: board.id }).url,
            { columns: next },
            { preserveScroll: true, preserveState: true },
        );
    };

    const columnsById = new Map(columns.map((c) => [c.id, c]));

    return (
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
            <SortableContext
                items={orderedIds}
                strategy={horizontalListSortingStrategy}
            >
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {orderedIds.map((id) => {
                        const column = columnsById.get(id);
                        if (!column) return null;
                        return (
                            <ShowBoardKanbanColumn key={id} column={column} />
                        );
                    })}

                    <Button variant="secondary" size="lg" className="w-80">
                        <PlusIcon />
                        Add another column
                    </Button>
                </div>
            </SortableContext>
        </DndContext>
    );
}
