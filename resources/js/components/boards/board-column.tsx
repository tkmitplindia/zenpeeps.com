import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { create } from '@/actions/App/Http/Controllers/TaskController';
import { EmptyColumn } from '@/components/boards/empty-column';
import { TaskCard } from '@/components/boards/task-card';
import type { BoardColumn as BoardColumnType } from '@/types';

type Props = {
    column: BoardColumnType;
};

export function BoardColumn({ column }: Props) {
    const taskIds = column.tasks?.map((t) => t.id) ?? [];
    const taskCount = column.tasks?.length ?? 0;

    const { setNodeRef } = useDroppable({ id: column.id });

    return (
        <div className="flex w-[280px] shrink-0 flex-col gap-2">
            <div className="flex items-center justify-between px-0.5">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">{column.name}</h3>
                    {taskCount > 0 && (
                        <span className="flex size-5 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground">
                            {taskCount}
                        </span>
                    )}
                </div>
                <Link
                    href={create.url(column.board_id, {
                        query: { column_id: column.id },
                    })}
                    className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="Add task"
                >
                    <Plus className="size-3.5" />
                </Link>
            </div>

            <SortableContext
                items={taskIds}
                strategy={verticalListSortingStrategy}
                id={column.id}
            >
                <div
                    ref={setNodeRef}
                    className="flex min-h-24 flex-col gap-2 rounded-xl bg-muted/40 p-2"
                    data-column-id={column.id}
                >
                    {taskCount === 0 ? (
                        <EmptyColumn column={column} />
                    ) : (
                        column.tasks?.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))
                    )}
                </div>
            </SortableContext>
        </div>
    );
}
