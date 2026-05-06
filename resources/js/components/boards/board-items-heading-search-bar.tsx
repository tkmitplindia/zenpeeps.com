import { useForm, usePage } from '@inertiajs/react';
import { SearchIcon } from 'lucide-react';
import { index } from '@/routes/boards/items';
import type { BoardItemsIndexPageProps } from '@/types/board';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function BoardItemsHeadingSearchBar() {
    const { board, filters } = usePage<BoardItemsIndexPageProps>().props;
    const { data, setData, get } = useForm({
        search: filters.search ?? '',
    });

    function onSubmit() {
        get(
            index(
                {
                    current_team: board.team.slug,
                    board: board.id,
                },
                {
                    query: {
                        ...filters,
                        search: data.search,
                    },
                },
            ).url,
        );
    }

    return (
        <div className="flex items-center gap-1">
            <Input
                placeholder="Search"
                value={data.search}
                onChange={(e) => setData('search', e.target.value)}
                onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                        onSubmit();
                    }
                }}
            />
            <Button variant="outline" onClick={onSubmit}>
                <SearchIcon className="size-4" />
            </Button>
        </div>
    );
}
