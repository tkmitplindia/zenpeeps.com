import {
    DndContext,
    DragOverlay,
    PointerSensor,
    closestCorners,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from '@dnd-kit/core';
import { useState } from 'react';
import { BoardColumn } from '@/components/boards/board-column';
import { TaskCard } from '@/components/boards/task-card';
import { useBoardDragAndDrop } from '@/hooks/use-board-drag-and-drop';
import type { Board, Task } from '@/types';

type Props = {
    board: Board;
};

export function KanbanBoard({ board: initialBoard }: Props) {
    const { board, handleDragEnd } = useBoardDragAndDrop(initialBoard);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    );

    function handleDragStart(event: DragStartEvent) {
        const id = event.active.id as string;
        const task = board.columns?.flatMap((c) => c.tasks ?? []).find((t) => t.id === id) ?? null;
        setActiveTask(task);
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveTask(null);
        handleDragEnd(event);
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={onDragEnd}
        >
            <div className="flex flex-1 gap-3 overflow-x-auto pb-4">
                {board.columns?.map((column) => (
                    <BoardColumn key={column.id} column={column} />
                ))}
            </div>

            <DragOverlay>
                {activeTask && <TaskCard task={activeTask} isDragging />}
            </DragOverlay>
        </DndContext>
    );
}
