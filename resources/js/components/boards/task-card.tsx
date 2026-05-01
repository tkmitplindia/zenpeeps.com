import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { router } from '@inertiajs/react';
import { CalendarDays, GripVertical } from 'lucide-react';
import { show } from '@/actions/App/Http/Controllers/TaskController';
import type { Task } from '@/types';

type Props = {
    task: Task;
    isDragging?: boolean;
};

export function TaskCard({ task, isDragging = false }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isSortableDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            onClick={() => router.visit(show(task.id).url)}
            className={`group flex cursor-pointer gap-2 rounded-lg border bg-card p-3.5 text-sm shadow-sm ${
                isDragging
                    ? 'rotate-1 opacity-95 shadow-lg'
                    : 'hover:border-primary/30 hover:shadow'
            }`}
        >
            {/* Drag handle — only this area initiates drag */}
            <div
                {...listeners}
                onClick={(e) => e.stopPropagation()}
                className="mt-0.5 shrink-0 cursor-grab text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
            >
                <GripVertical className="size-3.5" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                <p className="leading-snug font-medium">{task.title}</p>

                {(task.due_date || task.assignees?.length) && (
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                        {task.due_date && (
                            <span className="flex items-center gap-1">
                                <CalendarDays className="size-3" />
                                {new Date(task.due_date).toLocaleDateString(
                                    'en-US',
                                    {
                                        day: '2-digit',
                                        month: 'short',
                                    },
                                )}
                            </span>
                        )}
                        {task.assignees && task.assignees.length > 0 && (
                            <div className="ml-auto flex -space-x-1.5">
                                {task.assignees.slice(0, 3).map((a) => (
                                    <div
                                        key={a.id}
                                        className="flex size-5 items-center justify-center rounded-full border-2 border-card bg-primary text-[9px] font-semibold text-primary-foreground"
                                        title={a.name}
                                    >
                                        {a.name
                                            .split(' ')
                                            .map((n: string) => n[0])
                                            .join('')
                                            .slice(0, 2)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
