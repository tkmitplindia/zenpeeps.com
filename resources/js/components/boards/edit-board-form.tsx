import { useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ListInput } from '@/components/ui/list-input';
import { Textarea } from '@/components/ui/textarea';
import { show, update } from '@/routes/boards';

import type { Board } from '@/types';

type Props = {
    board: Board;
};

export function EditBoardForm({ board }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        name: board.name,
        description: board.description ?? '',
        columns: board.columns?.map((c) => c.name) ?? [],
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        patch(update.url(board.id as any));
    }

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setData('name', e.target.value)
                    }
                />
                <InputError message={errors.name} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setData('description', e.target.value)
                    }
                    rows={4}
                />
                <InputError message={errors.description} />
            </div>

            <div className="space-y-2">
                <Label>Columns</Label>
                <ListInput
                    value={data.columns}
                    onChange={(columns) => setData('columns', columns)}
                    placeholder="Add a column…"
                />
                <InputError message={errors.columns} />
            </div>

            <div className="flex items-center gap-3">
                <Button variant="outline" asChild>
                    <a href={show.url(board.id as any)}>Cancel</a>
                </Button>
                <Button type="submit" disabled={processing}>
                    Update
                </Button>
            </div>
        </form>
    );
}
