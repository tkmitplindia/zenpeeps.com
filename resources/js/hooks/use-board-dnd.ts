import {
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type {
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    Over,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { reorder as reorderColumns } from '@/routes/boards/columns';
import { reorder as reorderItems } from '@/routes/boards/items';
import type { BoardColumn, BoardItem, BoardShowPageProps } from '@/types/board';

export type BoardDndColumn = {
    id: string;
    column: BoardColumn;
    items: BoardItem[];
};

export const BOARD_COLUMN_DRAG_TYPE = 'column';
export const BOARD_ITEM_DRAG_TYPE = 'item';

type ActiveType =
    | typeof BOARD_COLUMN_DRAG_TYPE
    | typeof BOARD_ITEM_DRAG_TYPE
    | null;

export function useBoardDnd() {
    const { columns, board } = usePage<BoardShowPageProps>().props;
    const currentTeam = useCurrentTeam();

    // Local optimistic state. Server props are the source of truth — re-sync
    // during render whenever a fresh columns prop arrives so a failed request
    // snaps the UI back to reality.
    const [local, setLocal] = useState<BoardDndColumn[]>(() =>
        buildLocal(columns),
    );
    const [columnsSnapshot, setColumnsSnapshot] = useState(columns);

    if (columnsSnapshot !== columns) {
        setColumnsSnapshot(columns);
        setLocal(buildLocal(columns));
    }

    const [activeType, setActiveType] = useState<ActiveType>(null);
    const [activeId, setActiveId] = useState<string | null>(null);

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

    const activeItem = useMemo<BoardItem | null>(() => {
        if (activeType !== BOARD_ITEM_DRAG_TYPE || !activeId) {
            return null;
        }

        for (const c of local) {
            const found = c.items.find((i) => i.id === activeId);

            if (found) {
                return found;
            }
        }

        return null;
    }, [activeType, activeId, local]);

    const activeColumn = useMemo<BoardDndColumn | null>(() => {
        if (activeType !== BOARD_COLUMN_DRAG_TYPE || !activeId) {
            return null;
        }

        return local.find((c) => c.id === activeId) ?? null;
    }, [activeType, activeId, local]);

    // Resolve a drop target to a column index. The droppable inside each column
    // uses id `${columnId}:items` (distinct from the sortable column id) so the
    // collision graph stays unambiguous.
    const resolveOverColumnIndex = (over: Over): number => {
        const data = over.data.current as
            | { type?: string; columnId?: string }
            | undefined;

        if (data?.type === 'column-droppable' && data.columnId) {
            return local.findIndex((c) => c.id === data.columnId);
        }

        const itemColIdx = itemColumnIndex.get(over.id as string);

        if (itemColIdx !== undefined) {
            return itemColIdx;
        }

        return local.findIndex((c) => c.id === over.id);
    };

    const onDragStart = ({ active }: DragStartEvent) => {
        const type = active.data.current?.type;
        setActiveType(
            type === BOARD_COLUMN_DRAG_TYPE
                ? BOARD_COLUMN_DRAG_TYPE
                : BOARD_ITEM_DRAG_TYPE,
        );
        setActiveId(active.id as string);
    };

    const onDragOver = ({ active, over }: DragOverEvent) => {
        if (!over || activeType !== BOARD_ITEM_DRAG_TYPE) {
            return;
        }

        const fromCol = itemColumnIndex.get(active.id as string);

        if (fromCol === undefined) {
            return;
        }

        const overColIdx = resolveOverColumnIndex(over);

        if (overColIdx === -1) {
            return;
        }

        if (fromCol === overColIdx) {
            return;
        }

        // When dropping over a sibling item, insert at its position. Otherwise
        // (column body or empty column) append to the end.
        const overItemCol = itemColumnIndex.get(over.id as string);
        setLocal((prev) => {
            const next = prev.map((c) => ({ ...c, items: [...c.items] }));
            const [moved] = next[fromCol].items.splice(
                next[fromCol].items.findIndex((i) => i.id === active.id),
                1,
            );
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
        setActiveId(null);

        if (!over) {
            return;
        }

        if (type === BOARD_COLUMN_DRAG_TYPE) {
            if (active.id === over.id) {
                return;
            }

            const ids = local.map((c) => c.id);
            const from = ids.indexOf(active.id as string);
            const to = ids.indexOf(over.id as string);

            if (from === -1 || to === -1) {
                return;
            }

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

        if (colIdx === undefined) {
            return;
        }

        const overColIdx = resolveOverColumnIndex(over);

        if (overColIdx === -1) {
            return;
        }

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

                if (!before || before.id !== col.id) {
                    return true;
                }

                if (before.items.length !== col.items.length) {
                    return true;
                }

                return before.items.some(
                    (it, idx) => it.id !== col.items[idx]?.id,
                );
            })
            .map((col) => ({ id: col.id, items: col.items.map((i) => i.id) }));

        if (changedColumns.length === 0) {
            return;
        }

        router.patch(
            reorderItems({ current_team: currentTeam.slug, board: board.id })
                .url,
            { columns: changedColumns },
            { preserveScroll: true, preserveState: true },
        );
    };

    const onDragCancel = () => {
        setActiveType(null);
        setActiveId(null);
    };

    return {
        local,
        activeItem,
        activeColumn,
        sensors,
        collisionDetection: closestCorners,
        onDragStart,
        onDragOver,
        onDragEnd,
        onDragCancel,
    };
}

function buildLocal(columns: BoardColumn[]): BoardDndColumn[] {
    return columns.map((column) => ({
        id: column.id,
        column,
        items: column.items ?? [],
    }));
}
