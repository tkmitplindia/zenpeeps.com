import { router } from '@inertiajs/react';
import {
    ArchiveIcon,
    ArchiveRestoreIcon,
    ExternalLinkIcon,
    PencilIcon,
    TrashIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { edit, show, update } from '@/routes/boards';
import type { Board } from '@/types/board';
import { useBoardDialog } from './board-delete-dialog-provider';

export function BoardCardContextMenu({
    board,
    children,
}: {
    board: Board;
    children: ReactNode;
}) {
    const currentTeam = useCurrentTeam();
    const { confirmDelete } = useBoardDialog();
    const isArchived = board.status === 'archived';

    const open = () =>
        router.visit(
            show({ current_team: currentTeam.slug, board: board.id }).url,
        );

    const goToEdit = () =>
        router.visit(
            edit({ current_team: currentTeam.slug, board: board.id }).url,
        );

    const toggleArchive = () => {
        router.put(
            update({ current_team: currentTeam.slug, board: board.id }).url,
            {
                name: board.name,
                description: board.description,
                status: isArchived ? 'active' : 'archived',
                members: (board.members ?? []).map((m) => m.id),
            },
            { preserveScroll: true },
        );
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent className="w-48">
                <ContextMenuItem onSelect={open}>
                    <ExternalLinkIcon /> Open
                </ContextMenuItem>
                <ContextMenuItem onSelect={goToEdit}>
                    <PencilIcon /> Edit
                </ContextMenuItem>
                <ContextMenuItem onSelect={toggleArchive}>
                    {isArchived ? <ArchiveRestoreIcon /> : <ArchiveIcon />}
                    {isArchived ? 'Unarchive' : 'Archive'}
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                    onSelect={() => confirmDelete(board)}
                    className="text-destructive"
                >
                    <TrashIcon className="text-destructive" /> Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}
