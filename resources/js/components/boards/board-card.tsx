import { Link } from '@inertiajs/react';
import { Kanban, LayoutList, Rows3 } from 'lucide-react';
import { useRelativeTime } from '@/hooks/use-relative-time';
import { show } from '@/routes/boards';
import type { Board } from '@/types';

export function BoardCard({ board }: { board: Board }) {
    const { relativeTime } = useRelativeTime();

    return (
        <Link
            href={show.url(board.id as any)}
            className="flex flex-col gap-4 rounded-xl border bg-card p-5 hover:border-primary/30 hover:shadow-sm transition-all"
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex size-9 items-center justify-center rounded-lg border bg-muted">
                    <Kanban className="size-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Rows3 className="size-3.5" />
                        {board.columns?.length ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                        <LayoutList className="size-3.5" />
                        {board.tasks_count ?? 0}
                    </span>
                </div>
            </div>

            <div className="flex-1">
                <p className="font-semibold leading-snug">{board.name}</p>
                {board.description && (
                    <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                        {board.description}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Updated {relativeTime(board.updated_at)}</span>
            </div>
        </Link>
    );
}
