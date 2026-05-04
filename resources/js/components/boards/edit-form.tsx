import { usePage } from '@inertiajs/react';
import { AppMemberSelect } from '@/components/app-member-select';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useBoardEditForm } from '@/hooks/use-board-edit-form';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { update } from '@/routes/boards';
import type { User } from '@/types';
import type { BoardEditPageProps, BoardStatus } from '@/types/board';

const STATUS_OPTIONS: { value: BoardStatus; label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
];

export function EditBoardForm() {
    const { board, team_members } = usePage<BoardEditPageProps>().props;
    const currentTeam = useCurrentTeam();
    const { data, setData, put, processing, errors } = useBoardEditForm(board);

    return (
        <div className="space-y-6">
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
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
                />
                <InputError message={errors.description} />
            </div>

            <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                    value={data.status}
                    onValueChange={(value) =>
                        setData('status', value as BoardStatus)
                    }
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.status} />
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
                    onClick={() =>
                        put(
                            update({
                                current_team: currentTeam.slug,
                                board: board.id,
                            }).url,
                        )
                    }
                    disabled={processing}
                >
                    Save changes
                </Button>
            </div>
        </div>
    );
}
