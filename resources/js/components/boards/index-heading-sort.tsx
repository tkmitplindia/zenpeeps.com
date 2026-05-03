import { Link, usePage } from '@inertiajs/react';
import {
    ArrowDownWideNarrowIcon,
    ArrowUpNarrowWideIcon,
    ChevronDownIcon,
} from 'lucide-react';
import { index } from '@/routes/boards';
import type { BoardIndexPageProps } from '@/types/board';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function Sort() {
    const { filters, currentTeam } = usePage<BoardIndexPageProps>().props;
    const { sort, order } = filters;

    function DropdownLabel() {
        switch (sort) {
            case 'name':
                return 'Name';
            case 'description':
                return 'Description';
            case 'created_at':
                return 'Created';
            case 'updated_at':
                return 'Updated';
            default:
                return 'Name';
        }
    }

    function SortIcon() {
        if (order === 'asc') {
            return <ArrowUpNarrowWideIcon />;
        }

        return <ArrowDownWideNarrowIcon />;
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
                    <SortIcon />
                    {DropdownLabel()}
                    <ChevronDownIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem asChild>
                    <Link
                        href={
                            index(currentTeam!.slug, {
                                query: {
                                    ...filters,
                                    sort: 'name',
                                    order: getOrder('name'),
                                },
                            }).url
                        }
                    >
                        {sort === 'name' ? (
                            <SortIcon />
                        ) : (
                            <span className="size-4" />
                        )}
                        Name
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        href={
                            index(currentTeam!.slug, {
                                query: {
                                    ...filters,
                                    sort: 'description',
                                    order: getOrder('description'),
                                },
                            }).url
                        }
                    >
                        {sort === 'description' ? (
                            <SortIcon />
                        ) : (
                            <span className="size-4" />
                        )}
                        Description
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        href={
                            index(currentTeam!.slug, {
                                query: {
                                    ...filters,
                                    sort: 'created_at',
                                    order: getOrder('created_at'),
                                },
                            }).url
                        }
                    >
                        {sort === 'created_at' ? (
                            <SortIcon />
                        ) : (
                            <span className="size-4" />
                        )}
                        Created
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        href={
                            index(currentTeam!.slug, {
                                query: {
                                    ...filters,
                                    sort: 'updated_at',
                                    order: getOrder('updated_at'),
                                },
                            }).url
                        }
                    >
                        {sort === 'updated_at' ? (
                            <SortIcon />
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
