import { router, usePage } from '@inertiajs/react';
import { ArrowUpIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { useInitials } from '@/hooks/use-initials';
import { relativeTime } from '@/lib/relative-time';
import { destroy, store } from '@/routes/boards/items/comments';
import type { Auth } from '@/types';
import type { BoardItem, BoardItemComment } from '@/types/board';

export function ItemFormComments({ item }: { item: BoardItem }) {
    const currentTeam = useCurrentTeam();
    const initials = useInitials();
    const { auth } = usePage<{ auth: Auth }>().props;
    const [body, setBody] = useState('');

    const baseArgs = {
        current_team: currentTeam.slug,
        board: item.board_id,
        item: item.id,
    };

    const submit = () => {
        if (body.trim() === '') {
            return;
        }

        router.post(
            store(baseArgs).url,
            { body: body.trim() },
            {
                preserveScroll: true,
                onSuccess: () => setBody(''),
            },
        );
    };

    const remove = (comment: BoardItemComment) => {
        router.delete(destroy({ ...baseArgs, comment: comment.id }).url, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const comments = item.comments ?? [];

    return (
        <div className="grid gap-3">
            <Label>Comments</Label>

            <div className="flex items-start gap-3">
                <Avatar>
                    <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                    <AvatarFallback>{initials(auth.user.name)}</AvatarFallback>
                </Avatar>
                <div className="relative flex-1">
                    <Textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Type in your message to join in the conversation..."
                        rows={3}
                        className="resize-none pr-12"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                e.preventDefault();
                                submit();
                            }
                        }}
                    />
                    <Button
                        size="icon"
                        className="absolute right-2 bottom-2 size-8"
                        onClick={submit}
                        disabled={body.trim() === ''}
                        aria-label="Send comment"
                    >
                        <ArrowUpIcon />
                    </Button>
                </div>
            </div>

            <ul className="grid gap-4">
                {comments.map((c) => (
                    <li key={c.id} className="flex items-start gap-3">
                        <Avatar>
                            <AvatarImage
                                src={c.author?.avatar}
                                alt={c.author?.name}
                            />
                            <AvatarFallback>
                                {initials(c.author?.name ?? '')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                    {c.author?.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {relativeTime(c.created_at)}
                                </span>
                                {c.user_id === auth.user.id && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="ml-auto size-6"
                                        onClick={() => remove(c)}
                                        aria-label="Delete comment"
                                    >
                                        <Trash2Icon className="size-3.5" />
                                    </Button>
                                )}
                            </div>
                            <p className="text-sm">{c.body}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
