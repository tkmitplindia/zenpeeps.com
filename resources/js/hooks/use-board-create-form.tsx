import { useForm } from '@inertiajs/react';
import type { BoardStatus } from '@/types/board';

export function useBoardCreateForm() {
    const form = useForm({
        name: '',
        description: '',
        status: 'active' as BoardStatus,
        columns: ['To Do', 'In Progress', 'Done'],
        members: [] as string[],
    });

    form.transform((data) => ({
        ...data,
        columns: data.columns.map((name) => ({ name })),
    }));

    return form;
}
