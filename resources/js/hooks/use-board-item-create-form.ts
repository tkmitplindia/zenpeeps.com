import { useForm } from '@inertiajs/react';
import type { BoardItemPriority } from '@/types/board';

export function useBoardItemCreateForm(defaultColumnId: string) {
    return useForm({
        title: '',
        description: '',
        board_column_id: defaultColumnId,
        priority: 'medium' as BoardItemPriority,
        estimated_minutes: null as number | null,
        due_date: null as string | null,
        assignees: [] as string[],
        tags: [] as string[],
    });
}
