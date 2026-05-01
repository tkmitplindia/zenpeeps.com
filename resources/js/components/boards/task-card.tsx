import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CalendarDays } from 'lucide-react';
import type { Task } from '@/types';

type Props = {
    task: Task;
    isDragging?: boolean;
};

export function TaskCard({ task, isDragging = false }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } =
        useSortable({ id: task.id });

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
            {...listeners}
            className={`flex flex-col gap-2.5 rounded-lg border bg-card p-3.5 text-sm shadow-sm cursor-grab active:cursor-grabbing ${
                isDragging ? 'shadow-lg rotate-1 opacity-95' : 'hover:border-primary/30 hover:shadow'
            }`}
        >
            <p className="font-medium leading-snug">{task.title}</p>

            {(task.due_date || task.assignees?.length) && (
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    {task.due_date && (
                        <span className="flex items-center gap-1">
                            <CalendarDays className="size-3" />
                            {new Date(task.due_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                        </span>
                    )}
                    {task.assignees && task.assignees.length > 0 && (
                        <div className="flex -space-x-1.5 ml-auto">
                            {task.assignees.slice(0, 3).map((a) => (
                                <div
                                    key={a.id}
                                    className="flex size-5 items-center justify-center rounded-full border-2 border-card bg-primary text-[9px] font-semibold text-primary-foreground"
                                    title={a.name}
                                >
                                    {a.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
