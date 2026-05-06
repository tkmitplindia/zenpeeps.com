import { Link, usePage } from '@inertiajs/react';
import { LayoutGridIcon, ListIcon } from 'lucide-react';
import { index } from '@/routes/boards/items';
import type { BoardItemsIndexPageProps } from '@/types/board';
import { Button } from '../ui/button';
import { ButtonGroup } from '../ui/button-group';

export function BoardItemsHeadingViewSwitcher() {
    const { board, view, filters } = usePage<BoardItemsIndexPageProps>().props;

    return (
        <ButtonGroup>
            <Button
                variant={view === 'grid' ? 'outline' : 'secondary'}
                size="icon"
                asChild
            >
                <Link
                    href={
                        index(
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
                        index(
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
