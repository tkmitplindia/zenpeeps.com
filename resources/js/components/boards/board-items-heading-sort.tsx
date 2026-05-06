import { Link, usePage } from '@inertiajs/react';
import {
    ArrowDownWideNarrowIcon,
    ArrowUpNarrowWideIcon,
    ChevronDownIcon,
} from 'lucide-react';
import { index } from '@/routes/boards/items';
import type { BoardItemsIndexPageProps } from '@/types/board';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function BoardItemsHeadingSort() {
    const { board, filters } = usePage<BoardItemsIndexPageProps>().props;
    const { sort, order } = filters;

    function renderDropdownLabel() {
        switch (sort) {
            case 'name':
                return 'Name';
            case 'created_at':
                return 'Created';
            case 'updated_at':
                return 'Updated';
            default:
                return 'Name';
        }
    }

    function renderSortIcon() {
        if (order === 'asc') {
            return <ArrowUpNarrowWideIcon className="size-4" />;
        }

        return <ArrowDownWideNarrowIcon className="size-4" />;
    }

    function getOrder(_sort: string) {
        if (sort === _sort) {
            return order === 'asc' ? 'desc' : 'asc';
        }

        return 'asc';
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    {renderSortIcon()}
                    {renderDropdownLabel()}
                    <ChevronDownIcon className="ml-1 size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem asChild>
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
                                        sort: 'name',
                                        order: getOrder('name'),
                                    },
                                },
                            ).url
                        }
                    >
                        {sort === 'name' ? (
                            renderSortIcon()
                        ) : (
                            <span className="size-4" />
                        )}
                        Name
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
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
                                        sort: 'created_at',
                                        order: getOrder('created_at'),
                                    },
                                },
                            ).url
                        }
                    >
                        {sort === 'created_at' ? (
                            renderSortIcon()
                        ) : (
                            <span className="size-4" />
                        )}
                        Created
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
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
                                        sort: 'updated_at',
                                        order: getOrder('updated_at'),
                                    },
                                },
                            ).url
                        }
                    >
                        {sort === 'updated_at' ? (
                            renderSortIcon()
                        ) : (
                            <span className="size-4" />
                        )}
                        Updated
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
