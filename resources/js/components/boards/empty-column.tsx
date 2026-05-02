import { Link } from '@inertiajs/react';
import { ListTodo } from 'lucide-react';
import { create } from '@/actions/App/Http/Controllers/TaskController';
import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import type { BoardColumn } from '@/types/board';

type Props = {
    column: BoardColumn;
};

export function EmptyColumn({ column }: Props) {
    return (
        <Empty className="p-4 md:p-4">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <ListTodo />
                </EmptyMedia>
                <EmptyTitle className="text-sm">No tasks yet</EmptyTitle>
                <EmptyDescription>Add the first task to this column.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button size="sm" asChild>
                    <Link
                        href={create.url(column.board_id, {
                            query: { column_id: column.id },
                        })}
                    >
                        Add task
                    </Link>
                </Button>
            </EmptyContent>
        </Empty>
    );
}
