import { Link, usePage } from '@inertiajs/react';
import { LayoutGridIcon, ListIcon } from 'lucide-react';
import { show } from '@/routes/boards';
import type { BoardShowPageProps } from '@/types/board';
import { Button } from '../ui/button';
import { ButtonGroup } from '../ui/button-group';

export function ShowBoardHeadingViewSwitcher() {
    const { board, view, filters } = usePage<BoardShowPageProps>().props;

    return (
        <ButtonGroup>
            <Button
                variant={view === 'grid' ? 'outline' : 'secondary'}
                size="icon"
                asChild
            >
                <Link
                    href={
                        show(
                            {
                                current_team: board.team.slug,
                                board: board.id,
                            },
                            {
                                query: {
                                    ...filters,
                                    view: 'grid',
                                },
                            },
                        ).url
                    }
                >
                    <LayoutGridIcon className="size-4" />
                </Link>
            </Button>
            <Button
                variant={view === 'list' ? 'outline' : 'secondary'}
                size="icon"
                asChild
            >
                <Link
                    href={
                        show(
                            {
                                current_team: board.team.slug,
                                board: board.id,
                            },
                            {
                                query: {
                                    ...filters,
                                    view: 'list',
                                },
                            },
                        ).url
                    }
                >
                    <ListIcon className="size-4" />
                </Link>
            </Button>
        </ButtonGroup>
    );
}
