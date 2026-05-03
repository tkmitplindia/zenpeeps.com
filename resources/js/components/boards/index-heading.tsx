import { Link } from '@inertiajs/react';
import Heading from '../heading';
import { Button } from '../ui/button';
import { Team } from '@/types';
import { create } from '@/routes/boards';
import { PlusIcon } from 'lucide-react';
import { SearchBar } from './index-heading-search-bar';
import { StatusSwitcher } from './index-heading-status-switcher';
import { ViewSwitcher } from './index-heading-view-switcher';
import { Sort } from './index-heading-sort';

export function BoardIndexHeading({ currentTeam }: { currentTeam: Team }) {
    return (
        <>
            <Heading
                title="Boards"
                description="Manage your boards"
                actions={
                    <Button asChild>
                        <Link href={create(currentTeam.slug).url}>
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
