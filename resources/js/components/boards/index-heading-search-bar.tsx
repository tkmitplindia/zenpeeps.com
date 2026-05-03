import { useForm, usePage } from '@inertiajs/react';
import { SearchIcon } from 'lucide-react';
import { index } from '@/routes/boards';
import type { BoardIndexPageProps } from '@/types/board';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function SearchBar() {
    const { filters } = usePage<BoardIndexPageProps>().props;
    const { currentTeam } = usePage<BoardIndexPageProps>().props;
    const { data, setData, get } = useForm({
        ...filters,
        search: filters.search ?? '',
    });

    function onSubmit() {
        get(index(currentTeam!.slug).url);
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
                <SearchIcon />
            </Button>
        </div>
    );
}
