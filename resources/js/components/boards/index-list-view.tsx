import { Link, usePage } from '@inertiajs/react';
import { Columns3Icon, ListIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { show } from '@/routes/boards';
import type { Team, User } from '@/types';
import type { Board, BoardIndexPageProps } from '@/types/board';
import { BoardCardContextMenu } from './board-card-context-menu';

export function IndexListView() {
    const { boards, currentTeam } = usePage<
        BoardIndexPageProps & { currentTeam: Team }
    >().props;

    if (boards.data.length === 0) {
        return (
            <div className="flex animate-in flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center fade-in-50">
                <p className="text-sm text-muted-foreground">No boards found</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {boards.data.map((board) => (
                <BoardListRow
                    key={board.id}
                    board={board}
                    teamSlug={currentTeam.slug}
                />
            ))}
        </div>
    );
}

function BoardListRow({ board, teamSlug }: { board: Board; teamSlug: string }) {
    const initials = useInitials();
    const members = board.members ?? [];
    const visibleMembers = members.slice(0, 5);
    const remainingMembers = members.length - visibleMembers.length;

    return (
        <BoardCardContextMenu board={board}>
            <Link
                href={show({ current_team: teamSlug, board: board.id }).url}
                className="flex items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3 text-left shadow-sm transition-colors hover:bg-accent"
            >
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <h4 className="truncate text-sm leading-snug font-semibold">
                        {board.name}
                    </h4>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                        {board.description || 'No description provided.'}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-4 text-xs text-muted-foreground">
                    <span className="capitalize">{board.status}</span>
                    <span className="flex items-center gap-1">
                        <Columns3Icon className="size-3.5" />
                        {board.columns_count ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                        <ListIcon className="size-3.5" />
                        {board.items_count ?? 0}
                    </span>
                    <div className="flex -space-x-2">
                        {visibleMembers.map((member: User) => (
                            <Avatar
                                key={member.id}
                                className="size-6 border-2 border-card"
                            >
                                <AvatarImage
                                    src={member.avatar}
                                    alt={member.name}
                                />
                                <AvatarFallback className="text-[9px]">
                                    {initials(member.name)}
                                </AvatarFallback>
                            </Avatar>
                        ))}
                        {remainingMembers > 0 && (
                            <span className="flex size-6 items-center justify-center rounded-full border-2 border-card bg-secondary text-[9px] font-medium">
                                +{remainingMembers}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </BoardCardContextMenu>
    );
}
