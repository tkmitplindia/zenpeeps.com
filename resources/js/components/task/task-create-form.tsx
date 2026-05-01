import { Form } from '@inertiajs/react';
import { useState } from 'react';
import { TaskCreateMain } from '@/components/task/task-create-main';
import { TaskCreateSidebar } from '@/components/task/task-create-sidebar';
import { store } from '@/actions/App/Http/Controllers/TaskController';
import type { Board, BoardColumn } from '@/types';
import type { User } from '@/types/auth';

type Props = {
    board: Board & { columns: BoardColumn[] };
    selectedColumnId: string;
    members: User[];
};

export function TaskCreateForm({ board, selectedColumnId, members }: Props) {
    const [columnId, setColumnId] = useState(
        selectedColumnId ?? board.columns?.[0]?.id ?? '',
    );
    const [priority, setPriority] = useState<
        'low' | 'medium' | 'high' | 'urgent'
    >('medium');
    const [assigneeId, setAssigneeId] = useState('none');

    return (
        <Form {...store.form()}>
            {({ errors, processing }) => (
                <>
                    <input type="hidden" name="board_id" value={board.id} />
                    <input
                        type="hidden"
                        name="board_column_id"
                        value={columnId}
                    />
                    <input type="hidden" name="priority" value={priority} />
                    {assigneeId !== 'none' && (
                        <input
                            type="hidden"
                            name="assignee_ids[]"
                            value={assigneeId}
                        />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="col-span-1 md:col-span-2">
                            <TaskCreateMain
                                board={board}
                                errors={errors}
                                processing={processing}
                            />
                        </div>
                        <div className="col-span-1 md:col-span-1">
                            <TaskCreateSidebar
                                board={board}
                                columnId={columnId}
                                onColumnChange={setColumnId}
                                priority={priority}
                                onPriorityChange={setPriority}
                                assigneeId={assigneeId}
                                onAssigneeChange={setAssigneeId}
                                members={members}
                            />
                        </div>
                    </div>
                </>
            )}
        </Form>
    );
}
