import { router } from '@inertiajs/react';
import { update } from '@/routes/boards/items';
import type { BoardItem, BoardItemPriority } from '@/types/board';
import { useCurrentTeam } from './use-current-team';

export type BoardItemPatch = {
    title?: string;
    description?: string | null;
    board_column_id?: string;
    priority?: BoardItemPriority;
    estimated_minutes?: number | null;
    due_date?: string | null;
    assignees?: string[];
    tags?: string[];
};

export function useBoardItemPatch(item: BoardItem) {
    const currentTeam = useCurrentTeam();

    return (data: BoardItemPatch) => {
        router.patch(
            update({
                current_team: currentTeam.slug,
                board: item.board_id,
                item: item.id,
            }).url,
            data,
            { preserveScroll: true, preserveState: true },
        );
    };
}
