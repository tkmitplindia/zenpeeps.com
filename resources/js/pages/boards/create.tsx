import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { AppMemberSelect } from '@/components/app-member-select';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ListInput } from '@/components/ui/list-input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { index, store } from '@/routes/boards';
import type { Team, User } from '@/types';
import type { BoardCreatePageProps, BoardStatus } from '@/types/board';
import { useCurrentTeam } from '@/hooks/use-current-team';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';

export default function CreateBoardPage() {
    const { team_members } = usePage<BoardCreatePageProps>().props;
    const currentTeam = useCurrentTeam();

    const { data, setData, post, processing, errors, transform } = useForm({
        name: '',
        description: '',
        status: 'active' as BoardStatus,
        columns: ['To Do', 'In Progress', 'Done'],
        members: [] as string[],
    });

    transform((data) => ({
        ...data,
        columns: data.columns.map((name) => ({ name })),
    }));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(store(currentTeam.slug).url);
    };

    return (
        <div className="p-4">
            <Head title="Create Board" />

            <div className="space-y-6">
                <Heading
                    title="New Board"
                    description="Set up a new board with columns and team members."
                />

                <div className="max-w-xl">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Project Roadmap, Sprint Backlog..."
                                required
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">
                                Description (Optional)
                            </Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="What is this board for?"
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Columns</Label>
                            <p className="text-sm text-muted-foreground">
                                Define the stages for your tasks. Drag to
                                reorder.
                            </p>
                            <ListInput
                                value={data.columns}
                                onChange={(columns) =>
                                    setData('columns', columns)
                                }
                            />
                            <InputError message={errors.columns} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Members</Label>
                            <p className="text-sm text-muted-foreground">
                                Select team members who should have access to
                                this board.
                            </p>
                            <AppMemberSelect
                                members={team_members as User[]}
                                value={data.members}
                                onChange={(members) =>
                                    setData('members', members)
                                }
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
                            <Button type="submit" disabled={processing}>
                                Create Board
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

CreateBoardPage.layout = (props: { currentTeam: Team }) => ({
    breadcrumbs: [
        {
            title: 'Boards',
            href: index(props.currentTeam.slug).url,
        },
        {
            title: 'Create',
            href: '#',
        },
    ],
});
