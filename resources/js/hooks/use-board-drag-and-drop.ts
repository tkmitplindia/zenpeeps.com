import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import type { Board, BoardColumn } from '@/types';

export function useBoardDragAndDrop(initialBoard: Board) {
    const [board, setBoard] = useState(initialBoard);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find the source column and task
        const sourceColumn = board.columns?.find((col) =>
            col.tasks?.some((t) => t.id === activeId),
        );
        const task = sourceColumn?.tasks?.find((t) => t.id === activeId);

        if (!sourceColumn || !task) {
            return;
        }

        // Determine target column — over could be a column id or a task id
        const targetColumn =
            board.columns?.find((col) => col.id === overId) ??
            board.columns?.find((col) =>
                col.tasks?.some((t) => t.id === overId),
            );

        if (!targetColumn) {
            return;
        }

        const isSameColumn = sourceColumn.id === targetColumn.id;

        // Optimistic update
        setBoard((prev) => {
            const columns = prev.columns?.map((col): BoardColumn => {
                if (col.id === sourceColumn.id && col.id === targetColumn.id) {
                    // Reorder within same column
                    const tasks = col.tasks ?? [];
                    const oldIndex = tasks.findIndex((t) => t.id === activeId);
                    const newIndex = tasks.findIndex((t) => t.id === overId);

                    return {
                        ...col,
                        tasks: arrayMove(tasks, oldIndex, newIndex),
                    };
                }

                if (col.id === sourceColumn.id) {
                    return {
                        ...col,
                        tasks: (col.tasks ?? []).filter(
                            (t) => t.id !== activeId,
                        ),
                    };
                }

                if (col.id === targetColumn.id) {
                    const tasks = [...(col.tasks ?? [])];
                    const overIndex = tasks.findIndex((t) => t.id === overId);
                    const insertAt = overIndex >= 0 ? overIndex : tasks.length;
                    tasks.splice(insertAt, 0, {
                        ...task,
                        board_column_id: col.id,
                    });

                    return { ...col, tasks };
                }

                return col;
            });

            return { ...prev, columns };
        });

        // Persist to server
        router.patch(
            `/boards/${board.id}/tasks/${activeId}/move`,
            {
                board_column_id: targetColumn.id,
                position: isSameColumn
                    ? (targetColumn.tasks?.findIndex((t) => t.id === overId) ??
                      0)
                    : (targetColumn.tasks?.length ?? 0),
            },
            { preserveScroll: true, preserveState: true },
        );
    }

    return { board, handleDragEnd };
}
