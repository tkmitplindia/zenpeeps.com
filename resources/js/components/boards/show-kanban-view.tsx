import { useEffect, useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
    DndContext,
    type DragEndEvent,
    type DragOverEvent,
    type DragStartEvent,
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
import { reorder as reorderColumns } from '@/routes/boards/columns';
import { reorder as reorderItems } from '@/routes/boards/items';
import type { BoardColumn, BoardItem, BoardShowPageProps } from '@/types/board';
import { Button } from '../ui/button';
import { ShowBoardKanbanColumn } from './show-kanban-column';

type LocalColumn = { id: string; column: BoardColumn; items: BoardItem[] };

const COLUMN_DRAG_TYPE = 'column';
const ITEM_DRAG_TYPE = 'item';

export function ShowBoardKanbanView() {
    const { columns, board } = usePage<BoardShowPageProps>().props;
    const currentTeam = useCurrentTeam();

    // Local optimistic state. Server props are the source of truth — re-sync on
    // every refresh so a failed request snaps the UI back to reality.
    const [local, setLocal] = useState<LocalColumn[]>(() =>
        buildLocal(columns),
    );
    useEffect(() => {
        setLocal(buildLocal(columns));
    }, [columns]);

    const [activeType, setActiveType] = useState<
        typeof COLUMN_DRAG_TYPE | typeof ITEM_DRAG_TYPE | null
    >(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    );

    const itemColumnIndex = useMemo(() => {
        const map = new Map<string, number>();
        local.forEach((col, idx) =>
            col.items.forEach((i) => map.set(i.id, idx)),
        );
        return map;
    }, [local]);

    const onDragStart = ({ active }: DragStartEvent) => {
        const type = active.data.current?.type;
        setActiveType(
            type === COLUMN_DRAG_TYPE ? COLUMN_DRAG_TYPE : ITEM_DRAG_TYPE,
        );
    };

    const onDragOver = ({ active, over }: DragOverEvent) => {
        if (!over || activeType !== ITEM_DRAG_TYPE) return;

        const fromCol = itemColumnIndex.get(active.id as string);
        if (fromCol === undefined) return;

        // `over` may be either a sibling item or the column drop zone itself.
        const overItemCol = itemColumnIndex.get(over.id as string);
        const overColIdx =
            overItemCol ?? local.findIndex((c) => c.id === over.id);
        if (overColIdx === -1 || overColIdx === undefined) return;

        if (fromCol === overColIdx) return;

        setLocal((prev) => {
            const next = prev.map((c) => ({ ...c, items: [...c.items] }));
            const [moved] = next[fromCol].items.splice(
                next[fromCol].items.findIndex((i) => i.id === active.id),
                1,
            );
            // Insert at the position of the hovered item, or at the end of the column.
            const insertAt =
                overItemCol !== undefined
                    ? next[overColIdx].items.findIndex((i) => i.id === over.id)
                    : next[overColIdx].items.length;
            next[overColIdx].items.splice(Math.max(0, insertAt), 0, moved);
            return next;
        });
    };

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        const type = activeType;
        setActiveType(null);

        if (!over) return;

        if (type === COLUMN_DRAG_TYPE) {
            if (active.id === over.id) return;
            const ids = local.map((c) => c.id);
            const from = ids.indexOf(active.id as string);
            const to = ids.indexOf(over.id as string);
            if (from === -1 || to === -1) return;

            const reordered = arrayMove(local, from, to);
            setLocal(reordered);
            router.patch(
                reorderColumns({
                    current_team: currentTeam.slug,
                    board: board.id,
                }).url,
                { columns: reordered.map((c) => c.id) },
                { preserveScroll: true, preserveState: true },
            );
            return;
        }

        // Item drag end: finalize position. onDragOver has already moved the item
        // across columns; here we handle within-column reorder + persist.
        const colIdx = itemColumnIndex.get(active.id as string);
        if (colIdx === undefined) return;

        const overItemCol = itemColumnIndex.get(over.id as string);
        const overColIdx =
            overItemCol !== undefined
                ? overItemCol
                : local.findIndex((c) => c.id === over.id);
        if (overColIdx === -1 || overColIdx === undefined) return;

        let next = local;
        if (colIdx === overColIdx && active.id !== over.id) {
            const items = local[colIdx].items;
            const from = items.findIndex((i) => i.id === active.id);
            const to = items.findIndex((i) => i.id === over.id);
            if (from !== -1 && to !== -1) {
                next = local.map((c, i) =>
                    i === colIdx
                        ? { ...c, items: arrayMove(items, from, to) }
                        : c,
                );
                setLocal(next);
            }
        }

        // Persist both source (if it changed) and destination columns.
        const original = buildLocal(columns);
        const changedColumns = next
            .filter((col, i) => {
                const before = original[i];
                if (!before || before.id !== col.id) return true;
                if (before.items.length !== col.items.length) return true;
                return before.items.some(
                    (it, idx) => it.id !== col.items[idx]?.id,
                );
            })
            .map((col) => ({ id: col.id, items: col.items.map((i) => i.id) }));

        if (changedColumns.length === 0) return;

        router.patch(
            reorderItems({ current_team: currentTeam.slug, board: board.id })
                .url,
            { columns: changedColumns },
            { preserveScroll: true, preserveState: true },
        );
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
        >
            <SortableContext
                items={local.map((c) => c.id)}
                strategy={horizontalListSortingStrategy}
            >
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {local.map((c) => (
                        <ShowBoardKanbanColumn
                            key={c.id}
                            column={c.column}
                            items={c.items}
                        />
                    ))}

                    <Button variant="secondary" size="lg" className="w-80">
                        <PlusIcon />
                        Add another column
                    </Button>
                </div>
            </SortableContext>
        </DndContext>
    );
}

function buildLocal(columns: BoardColumn[]): LocalColumn[] {
    return columns.map((column) => ({
        id: column.id,
        column,
        items: column.items ?? [],
    }));
}
