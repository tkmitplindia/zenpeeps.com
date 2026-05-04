import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
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
import { useBoardItemCreateForm } from '@/hooks/use-board-item-create-form';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { store } from '@/routes/boards/items';
import type {
    BoardItemCreatePageProps,
    BoardItemPriority,
} from '@/types/board';

const PRIORITY_OPTIONS: { value: BoardItemPriority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
];

export function CreateBoardItemForm() {
    const { board, columns, members } =
        usePage<BoardItemCreatePageProps>().props;
    const currentTeam = useCurrentTeam();
    const form = useBoardItemCreateForm(columns[0]?.id ?? '');
    const { data, setData, post, processing, errors } = form;

    useEffect(() => {
        if (data.board_column_id === '' && columns[0]) {
            setData('board_column_id', columns[0].id);
        }
    }, [columns, data.board_column_id, setData]);

    return (
        <div className="space-y-6">
            <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Setup UX storyboard..."
                    required
                />
                <InputError message={errors.title} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={4}
                    placeholder="Collect and analyze user feedback..."
                />
                <InputError message={errors.description} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>Column</Label>
                    <Select
                        value={data.board_column_id}
                        onValueChange={(value) =>
                            setData('board_column_id', value)
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pick a column" />
                        </SelectTrigger>
                        <SelectContent>
                            {columns.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.board_column_id} />
                </div>

                <div className="grid gap-2">
                    <Label>Priority</Label>
                    <Select
                        value={data.priority}
                        onValueChange={(value) =>
                            setData('priority', value as BoardItemPriority)
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PRIORITY_OPTIONS.map((p) => (
                                <SelectItem key={p.value} value={p.value}>
                                    {p.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.priority} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label>Assigned To</Label>
                <AppMemberSelect
                    members={members}
                    value={data.assignees}
                    onChange={(value) => setData('assignees', value)}
                    variant="dropdown"
                />
                <InputError message={errors.assignees} />
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
                    Create Task
                </Button>
            </div>
        </div>
    );
}
