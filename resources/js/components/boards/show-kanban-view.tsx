import { usePage } from '@inertiajs/react';
import type { BoardShowPageProps } from '@/types/board';
import { ShowBoardKanbanColumn } from './show-kanban-column';
import { Button } from '../ui/button';
import { PlusIcon } from 'lucide-react';

export function ShowBoardKanbanView() {
    const { columns } = usePage<BoardShowPageProps>().props;

    return (
        <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((column) => (
                <ShowBoardKanbanColumn key={column.id} column={column} />
            ))}

            {/* Add Column Placeholder */}
            <Button variant="secondary" size="lg" className="w-80">
                <PlusIcon />
                Add another column
            </Button>
        </div>
    );
}
