import { Link, usePage } from '@inertiajs/react';
import { show } from '@/routes/boards';
import type { Team } from '@/types';
import type { BoardIndexPageProps } from '@/types/board';

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
        <div className="flex flex-col rounded-xl border">
            {boards.data.map((board, index) => (
                <Link
                    key={board.id}
                    href={
                        show({
                            current_team: currentTeam.slug,
                            board: board.id,
                        }).url
                    }
                    className={`flex flex-col justify-between p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center ${
                        index !== boards.data.length - 1 ? 'border-b' : ''
                    }`}
                >
                    <div className="mb-2 flex flex-col gap-1 sm:mb-0">
                        <span className="font-semibold">{board.name}</span>
                        <span className="line-clamp-1 text-sm text-muted-foreground">
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
