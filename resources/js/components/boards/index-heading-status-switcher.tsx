import { Link, usePage } from '@inertiajs/react';
import { Button } from '../ui/button';
import { ButtonGroup } from '../ui/button-group';
import { ActivityIcon, ArchiveIcon } from 'lucide-react';
import { index } from '@/routes/boards';
import { BoardIndexPageProps } from '@/types/board';

export function StatusSwitcher() {
    const { status, filters } = usePage<BoardIndexPageProps>().props;
    const { currentTeam } = usePage<BoardIndexPageProps>().props;

    return (
        <ButtonGroup>
            <Button
                variant={status === 'active' ? 'outline' : 'secondary'}
                size="icon"
                asChild
            >
                <Link
                    href={
                        index(currentTeam!.slug, {
                            query: {
                                ...filters,
                                status: 'active',
                            },
                        }).url
                    }
                >
                    <ActivityIcon />
                </Link>
            </Button>
            <Button
                variant={status === 'archived' ? 'outline' : 'secondary'}
                size="icon"
                asChild
            >
                <Link
                    href={
                        index(currentTeam!.slug, {
                            query: {
                                ...filters,
                                status: 'archived',
                            },
                        }).url
                    }
                >
                    <ArchiveIcon />
                </Link>
            </Button>
        </ButtonGroup>
    );
}
