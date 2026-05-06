import { Link, usePage } from '@inertiajs/react';
import { Columns3Icon, KanbanSquareIcon, ListIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { relativeTime } from '@/lib/relative-time';
import { show } from '@/routes/boards';
import type { Team, User } from '@/types';
import type { Board, BoardIndexPageProps } from '@/types/board';
import { BoardCardContextMenu } from './board-card-context-menu';

export function IndexGridView() {
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {boards.data.map((board) => (
                <BoardCard
                    key={board.id}
                    board={board}
                    teamSlug={currentTeam.slug}
                />
            ))}
        </div>
    );
}

function BoardCard({ board, teamSlug }: { board: Board; teamSlug: string }) {
    const initials = useInitials();
    const members = board.members ?? [];
    const visibleMembers = members.slice(0, 5);
    const remainingMembers = members.length - visibleMembers.length;

    return (
        <BoardCardContextMenu board={board}>
            <Link
                href={show({ current_team: teamSlug, board: board.id }).url}
                className="flex h-full flex-col gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
            >
                <div className="flex items-start justify-between">
                    <KanbanSquareIcon className="size-4 text-muted-foreground" />
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Columns3Icon className="size-3.5" />
                            {board.columns_count ?? 0}
                        </span>
                        <span className="flex items-center gap-1">
                            <ListIcon className="size-3.5" />
                            {board.items_count ?? 0}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="leading-tight font-semibold">
                        {board.name}
                    </h3>
                    {board.description && (
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                            {board.description}
                        </p>
                    )}
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex -space-x-2">
                        {visibleMembers.map((member: User) => (
                            <Avatar
                                key={member.id}
                                className="size-7 border-2 border-card"
                            >
                                <AvatarImage
                                    src={member.avatar}
                                    alt={member.name}
                                />
                                <AvatarFallback className="text-[10px]">
                                    {initials(member.name)}
                                </AvatarFallback>
                            </Avatar>
                        ))}
                        {remainingMembers > 0 && (
                            <span className="flex size-7 items-center justify-center rounded-full border-2 border-card bg-secondary text-[10px] font-medium">
                                +{remainingMembers}
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                        Updated {relativeTime(board.updated_at)}
                    </span>
                </div>
            </Link>
        </BoardCardContextMenu>
    );
}
