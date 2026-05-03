import { GripVerticalIcon, KanbanIcon, PlusIcon } from 'lucide-react';
import type { BoardColumn } from '@/types/board';
import { Button } from '../ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '../ui/empty';

export function ShowBoardKanbanColumn({ column }: { column: BoardColumn }) {
    return (
        <div className="flex w-80 shrink-0 flex-col gap-4 rounded-xl bg-sidebar p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                        {column.name}
                    </h3>
                    <span className="flex size-6 items-center justify-center rounded-full bg-secondary text-xs font-medium text-muted-foreground">
                        0
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="size-8">
                        <GripVerticalIcon className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8">
                        <PlusIcon className="size-4" />
                    </Button>
                </div>
            </div>

            <Empty>
                <EmptyHeader>
                    <EmptyMedia>
                        <KanbanIcon />
                    </EmptyMedia>
                    <EmptyTitle>No items yet</EmptyTitle>
                    <EmptyDescription>
                        Add items to this column to get started
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button variant="secondary">
                        <PlusIcon />
                        Add item
                    </Button>
                </EmptyContent>
            </Empty>
        </div>
    );
}
