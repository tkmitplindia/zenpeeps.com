import { Link, usePage } from '@inertiajs/react';
import { LayoutGridIcon, ListIcon } from 'lucide-react';
import { index } from '@/routes/boards';
import type { BoardIndexPageProps } from '@/types/board';
import { Button } from '../ui/button';
import { ButtonGroup } from '../ui/button-group';

export function ViewSwitcher() {
    const { view, filters } = usePage<BoardIndexPageProps>().props;
    const { currentTeam } = usePage<BoardIndexPageProps>().props;

    return (
        <ButtonGroup>
            <Button
                variant={view === 'grid' ? 'outline' : 'secondary'}
                size="icon"
                asChild
            >
                <Link
                    href={
                        index(currentTeam!.slug, {
                            query: {
                                ...filters,
                                view: 'grid',
                            },
                        }).url
                    }
                >
                    <LayoutGridIcon />
                </Link>
            </Button>
            <Button
                variant={view === 'list' ? 'outline' : 'secondary'}
                size="icon"
                asChild
            >
                <Link
                    href={
                        index(currentTeam!.slug, {
                            query: {
                                ...filters,
                                view: 'list',
                            },
                        }).url
                    }
                >
                    <ListIcon />
                </Link>
            </Button>
        </ButtonGroup>
    );
}
