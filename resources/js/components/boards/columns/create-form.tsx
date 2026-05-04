import { usePage } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBoardColumnCreateForm } from '@/hooks/use-board-column-create-form';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { store } from '@/routes/boards/columns';
import type { BoardColumnCreatePageProps } from '@/types/board';

export function CreateBoardColumnForm() {
    const { board } = usePage<BoardColumnCreatePageProps>().props;
    const currentTeam = useCurrentTeam();
    const { data, setData, post, processing, errors } =
        useBoardColumnCreateForm();

    return (
        <div className="space-y-6">
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="To Do, In Progress, Done..."
                    autoFocus
                    required
                />
                <InputError message={errors.name} />
            </div>

            <div className="flex items-center justify-end gap-4 border-t pt-6">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => window.history.back()}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={() =>
                        post(
                            store({
                                current_team: currentTeam.slug,
                                board: board.id,
                            }).url,
                        )
                    }
                    disabled={processing}
                >
                    Add Column
                </Button>
            </div>
        </div>
    );
}
