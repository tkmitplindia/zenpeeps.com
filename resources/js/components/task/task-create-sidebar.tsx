import { CalendarDays, Clock, Flag } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PRIORITIES, SidebarLabel } from '@/components/task/task-sidebar';
import type { Board, BoardColumn } from '@/types';
import type { User } from '@/types/auth';

type Priority = 'low' | 'medium' | 'high' | 'urgent';

type Props = {
    board: Board & { columns: BoardColumn[] };
    columnId: string;
    onColumnChange: (v: string) => void;
    priority: Priority;
    onPriorityChange: (v: Priority) => void;
    assigneeId: string;
    onAssigneeChange: (v: string) => void;
    members: User[];
};

export function TaskCreateSidebar({
    board,
    columnId,
    onColumnChange,
    priority,
    onPriorityChange,
    assigneeId,
    onAssigneeChange,
    members,
}: Props) {
    const priorityOption = PRIORITIES.find((p) => p.value === priority) ?? PRIORITIES[1];

    return (
        <aside className="flex w-[300px] shrink-0 flex-col gap-5 overflow-y-auto border-l bg-card px-5 py-6">
            {/* Column */}
            <div>
                <SidebarLabel>Column</SidebarLabel>
                <Select value={columnId} onValueChange={onColumnChange}>
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                        {board.columns?.map((col) => (
                            <SelectItem key={col.id} value={col.id}>{col.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Priority */}
            <div>
                <SidebarLabel>Priority</SidebarLabel>
                <Select value={priority} onValueChange={(v) => onPriorityChange(v as Priority)}>
                    <SelectTrigger className="h-9">
                        <SelectValue>
                            <span className="flex items-center gap-2">
                                <Flag className={`size-3.5 ${priorityOption.color}`} />
                                <span className={`text-sm font-medium ${priorityOption.color}`}>{priorityOption.label}</span>
                            </span>
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {PRIORITIES.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                                <span className="flex items-center gap-2">
                                    <Flag className={`size-3.5 ${p.color}`} />
                                    <span className={p.color}>{p.label}</span>
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Assigned To */}
            <div>
                <SidebarLabel>Assigned To</SidebarLabel>
                <Select value={assigneeId} onValueChange={onAssigneeChange}>
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Unassigned</SelectItem>
                        {members.map((m) => (
                            <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Due Date */}
            <div>
                <SidebarLabel>Due Date</SidebarLabel>
                <div className="flex h-9 items-center gap-2 rounded-md border px-3">
                    <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
                    <input
                        type="date"
                        name="due_date"
                        className="flex-1 bg-transparent text-sm outline-none"
                    />
                </div>
            </div>

            {/* Estimate */}
            <div>
                <SidebarLabel>Estimate (minutes)</SidebarLabel>
                <div className="flex h-9 items-center gap-2 rounded-md border px-3">
                    <Clock className="size-4 shrink-0 text-muted-foreground" />
                    <input
                        type="number"
                        name="estimate_minutes"
                        min="1"
                        placeholder="e.g. 60"
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                </div>
            </div>
        </aside>
    );
}
