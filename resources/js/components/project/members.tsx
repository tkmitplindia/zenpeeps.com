import { Form } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import ProjectMemberController from '@/actions/App/Http/Controllers/ProjectMemberController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { Spinner } from '@/components/ui/spinner';
import type { Project, ProjectMember, ProjectRole, User } from '@/types';

const initials = (name: string): string =>
    name
        .split(' ')
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

export function ProjectMembers({
    project,
    members,
    roles,
}: {
    project: Project & { owner: User };
    members: ProjectMember[];
    roles: ProjectRole[];
}) {
    return (
        <section className="space-y-6">
            <Heading
                variant="small"
                title="Members"
                description="Invite collaborators by email and set their role."
            />

            <Form
                {...ProjectMemberController.store.form(project.id)}
                options={{ preserveScroll: true }}
                resetOnSuccess={['email']}
                className="grid gap-3 sm:grid-cols-[1fr_180px_auto] sm:items-end"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-1.5">
                            <Label htmlFor="invite-email">Email</Label>
                            <Input
                                id="invite-email"
                                type="email"
                                name="email"
                                required
                                placeholder="teammate@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="invite-role">Role</Label>
                            <Select name="role" defaultValue="collaborator">
                                <SelectTrigger id="invite-role">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem
                                            key={role}
                                            value={role}
                                            className="capitalize"
                                        >
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role} />
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner />}
                            Invite
                        </Button>
                    </>
                )}
            </Form>

            <ul className="flex flex-col divide-y">
                {members.map((member) => {
                    const isOwner = member.id === project.owner.id;

                    return (
                        <li
                            key={member.id}
                            className="flex items-center justify-between px-4 py-3"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback>
                                        {initials(member.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">
                                            {member.name}
                                        </span>
                                        {isOwner && (
                                            <Badge
                                                variant="default"
                                                className="text-[10px]"
                                            >
                                                Owner
                                            </Badge>
                                        )}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {member.email}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="capitalize">
                                    {member.pivot.role}
                                </Badge>
                                {!isOwner && (
                                    <Form
                                        {...ProjectMemberController.destroy.form(
                                            [project.id, member.id],
                                        )}
                                        options={{ preserveScroll: true }}
                                    >
                                        {({ processing }) => (
                                            <Button
                                                type="submit"
                                                variant="ghost"
                                                size="sm"
                                                disabled={processing}
                                                aria-label={`Remove ${member.name}`}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        )}
                                    </Form>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
