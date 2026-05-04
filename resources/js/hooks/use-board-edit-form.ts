import { useForm } from '@inertiajs/react';
import type { Board, BoardStatus } from '@/types/board';

export function useBoardEditForm(board: Board) {
    return useForm({
        name: board.name,
        description: board.description ?? '',
        status: board.status as BoardStatus,
        members: (board.members ?? []).map((m) => m.id),
    });
}
