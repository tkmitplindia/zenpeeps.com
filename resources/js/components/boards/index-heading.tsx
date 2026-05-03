import Heading from '../heading';
import { Button } from '../ui/button';
import { create } from '@/routes/boards';
import { PlusIcon } from 'lucide-react';
import { SearchBar } from './index-heading-search-bar';
import { StatusSwitcher } from './index-heading-status-switcher';
import { ViewSwitcher } from './index-heading-view-switcher';
import { Sort } from './index-heading-sort';
import { Link, usePage } from '@inertiajs/react';
import { BoardIndexPageProps } from '@/types/board';

export function BoardIndexHeading() {
    const { currentTeam } = usePage<BoardIndexPageProps>().props;

    return (
        <>
            <Heading
                title="Boards"
                description="Manage your boards"
                actions={
                    <Button asChild>
                        <Link href={create(currentTeam!.slug).url}>
                            <PlusIcon /> New Board
                        </Link>
                    </Button>
                }
            />
            <div className="flex items-center justify-between">
                <SearchBar />
                <div className="flex items-center justify-end gap-4">
                    <StatusSwitcher />
                    <ViewSwitcher />
                    <Sort />
                </div>
            </div>
        </>
    );
}
