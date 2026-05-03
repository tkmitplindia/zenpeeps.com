import { Link, usePage } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { show } from '@/routes/boards';
import type { Team } from '@/types';
import type { BoardIndexPageProps } from '@/types/board';

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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {boards.data.map((board) => (
                <Link
                    key={board.id}
                    href={
                        show({
                            current_team: currentTeam.slug,
                            board: board.id,
                        }).url
                    }
                >
                    <Card className="flex h-full flex-col transition-colors hover:bg-muted/50">
                        <CardHeader>
                            <CardTitle>{board.name}</CardTitle>
                            <CardDescription className="line-clamp-2">
                                {board.description ||
                                    'No description provided.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="capitalize">
                                    {board.status}
                                </span>
                                <span>•</span>
                                <span>
                                    {board.columns?.length || 0} columns
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
