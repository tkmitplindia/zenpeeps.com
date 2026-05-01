import { TaskAttachments } from '@/components/task/task-attachments';
import { TaskChecklist } from '@/components/task/task-checklist';
import { TaskDescription } from '@/components/task/task-description';
import { TaskDiscussions } from '@/components/task/task-discussions';
import { TaskHeader } from '@/components/task/task-header';
import { TaskSidebar } from '@/components/task/task-sidebar';
import type { Board, Task, TaskItem } from '@/types';

type Props = {
    task: Task;
    previousTask: Task | null;
    nextTask: Task | null;
};

export function TaskEditForm({ task, previousTask, nextTask }: Props) {
    const board = task.board as Board;
    const items = (task.items ?? []) as TaskItem[];

    return (
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
            <div className="col-span-1 flex-1 md:col-span-2">
                <TaskHeader
                    task={task}
                    previousTask={previousTask}
                    nextTask={nextTask}
                />
                <TaskDescription task={task} />
                <div className="mt-6">
                    <TaskChecklist task={task} items={items} />
                </div>
                <div className="mt-6">
                    <TaskAttachments task={task} />
                </div>
                <div className="mt-6 pb-6">
                    <TaskDiscussions task={task} />
                </div>
            </div>
            <TaskSidebar
                task={task}
                board={board}
                previousTask={previousTask}
                nextTask={nextTask}
            />
        </div>
    );
}
