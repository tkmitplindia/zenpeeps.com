import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { TaskCard } from '@/components/boards/task-card';
import type { BoardColumn as BoardColumnType } from '@/types';

type Props = {
    column: BoardColumnType;
};

export function BoardColumn({ column }: Props) {
    const taskIds = column.tasks?.map((t) => t.id) ?? [];
    const taskCount = column.tasks?.length ?? 0;

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
                <button
                    className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    aria-label="Add task"
                >
                    <Plus className="size-3.5" />
                </button>
            </div>

            <SortableContext items={taskIds} strategy={verticalListSortingStrategy} id={column.id}>
                <div
                    className="flex min-h-24 flex-col gap-2 rounded-xl bg-muted/40 p-2"
                    data-column-id={column.id}
                >
                    {column.tasks?.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
}
