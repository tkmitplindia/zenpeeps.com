import { Link, router, usePage } from '@inertiajs/react';
import {
    ArchiveIcon,
    MoreVerticalIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { edit, update } from '@/routes/boards';
import type { Board, BoardItemsIndexPageProps } from '@/types/board';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useBoardDialog } from './board-delete-dialog-provider';
import { useCurrentTeam } from '@/hooks/use-current-team';

export function BoardItemsHeadingMenu() {
    const { board } = usePage<BoardItemsIndexPageProps>().props;
    const { confirmDelete } = useBoardDialog();
    const [boardToArchive, setBoardToArchive] = useState<Board | null>(null);
    const currentTeam = useCurrentTeam();

    const confirmArchive = useCallback((target: Board) => {
        setBoardToArchive(target);
    }, []);

    const closeArchive = useCallback(() => setBoardToArchive(null), []);

    const archiveStatus = board.status === 'archived' ? 'active' : 'archived';

    const archiveBoard = () => {
        router.put(
            update({ current_team: currentTeam.slug, board: board.id }).url,
            {
                name: board.name,
                description: board.description,
                status: archiveStatus,
                members: (board.members ?? []).map((m) => m.id),
            },
            {
                preserveScroll: true,
                onSuccess: () => closeArchive(),
            },
        );
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <MoreVerticalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <PlusIcon /> Add Column
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <PlusIcon /> Add Task
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link href={edit({ current_team: board.team.slug, board: board.id }).url}>
                                <PencilIcon /> Edit Board
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={() => confirmArchive(board)}
                        >
                            <ArchiveIcon />
                            Archive Board
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onSelect={() => confirmDelete(board)}
                            className="text-destructive"
                        >
                            <TrashIcon className="text-destructive" /> Delete Board
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <BoardArchiveDialog
                board={boardToArchive}
                onClose={closeArchive}
                onArchive={archiveBoard}
            />
        </>
    );
}

function BoardArchiveDialog({
    board,
    onClose,
    onArchive,
}: {
    board: Board | null;
    onClose: () => void;
    onArchive: () => void;
}) {
    const open = board !== null;

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) {
                    onClose();
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Archive board</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to archive{' '}
                        <span className="font-semibold text-foreground">
                            {board?.name}
                        </span>
                        ? You can always unarchive it later.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onArchive}
                    >
                        Archive board
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
