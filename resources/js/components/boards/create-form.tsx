import { AppMemberSelect } from '@/components/app-member-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ListInput } from '@/components/ui/list-input';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { useBoardCreateForm } from '@/hooks/use-board-create-form';
import type { User } from '@/types';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { usePage } from '@inertiajs/react';
import type { BoardCreatePageProps } from '@/types/board';
import { store } from '@/routes/boards';

export function CreateBoardForm() {
    const { data, setData, post, processing, errors } = useBoardCreateForm();
    const { team_members } = usePage<BoardCreatePageProps>().props;
    const currentTeam = useCurrentTeam();
    return (
        <div className="space-y-6">
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Project Roadmap, Sprint Backlog..."
                    required
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="What is this board for?"
                />
                <InputError message={errors.description} />
            </div>

            <div className="grid gap-2">
                <Label>Columns</Label>
                <p className="text-sm text-muted-foreground">
                    Define the stages for your tasks. Drag to reorder.
                </p>
                <ListInput
                    value={data.columns}
                    onChange={(columns) => setData('columns', columns)}
                />
                <InputError message={errors.columns} />
            </div>

            <div className="grid gap-2">
                <Label>Members</Label>
                <p className="text-sm text-muted-foreground">
                    Select team members who should have access to this board.
                </p>
                <AppMemberSelect
                    members={team_members as User[]}
                    value={data.members}
                    onChange={(members) => setData('members', members)}
                    variant="grid"
                />
                <InputError message={errors.members} />
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
                    onClick={() => {
                        post(store(currentTeam.slug).url);
                    }}
                    disabled={processing}
                >
                    Create Board
                </Button>
            </div>
        </div>
    );
}
