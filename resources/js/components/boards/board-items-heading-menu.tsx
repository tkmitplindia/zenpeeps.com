import { Link, usePage } from '@inertiajs/react';
import {
    ArchiveIcon,
    MoreVerticalIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from 'lucide-react';
import { edit } from '@/routes/boards';
import type { BoardItemsIndexPageProps } from '@/types/board';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useBoardDialog } from './board-delete-dialog-provider';

export function BoardItemsHeadingMenu() {
    const { board } = usePage<BoardItemsIndexPageProps>().props;
    const { confirmDelete } = useBoardDialog();

    return (
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
                    <DropdownMenuItem>
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
    );
}
