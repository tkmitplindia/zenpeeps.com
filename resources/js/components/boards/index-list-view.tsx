import { Link, usePage } from '@inertiajs/react';
import { BoardIndexPageProps } from '@/types/board';
import { Team } from '@/types';
import { show } from '@/routes/boards';

export function IndexListView() {
    const { boards, currentTeam } = usePage<BoardIndexPageProps & { currentTeam: Team }>().props;

    if (boards.data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center animate-in fade-in-50">
                <p className="text-sm text-muted-foreground">No boards found</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col rounded-xl border">
            {boards.data.map((board, index) => (
                <Link
                    key={board.id}
                    href={show({ current_team: currentTeam.slug, board: board.id }).url}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/50 transition-colors ${
                        index !== boards.data.length - 1 ? 'border-b' : ''
                    }`}
                >
                    <div className="flex flex-col gap-1 mb-2 sm:mb-0">
                        <span className="font-semibold">{board.name}</span>
                        <span className="text-sm text-muted-foreground line-clamp-1">
                            {board.description || 'No description provided.'}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="capitalize">{board.status}</span>
                        <span>{board.columns?.length || 0} columns</span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
