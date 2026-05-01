import { router } from '@inertiajs/react';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Sparkles,
    Underline,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { update } from '@/actions/App/Http/Controllers/TaskController';
import type { Task } from '@/types';

type Props = {
    task: Task;
};

export function TaskDescription({ task }: Props) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(task.description ?? '');

    function handleSave() {
        router.patch(
            update(task.id).url,
            { description: value },
            {
                preserveScroll: true,
                onSuccess: () => setEditing(false),
            },
        );
    }

    return (
        <div className="rounded-xl border bg-card p-3">
            {editing ? (
                <Textarea
                    autoFocus
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            setEditing(false);
                            setValue(task.description ?? '');
                        }
                    }}
                    className="min-h-[80px] resize-none border-0 p-0 text-sm shadow-none focus-visible:ring-0"
                    placeholder="Add a description..."
                />
            ) : (
                <p
                    className="min-h-[60px] cursor-text text-sm text-muted-foreground"
                    onClick={() => setEditing(true)}
                >
                    {task.description || 'Add a description...'}
                </p>
            )}

            {/* Formatting toolbar (stub) */}
            <div className="mt-2 flex items-center gap-0.5 border-t pt-2">
                <Button variant="ghost" size="icon" className="size-7">
                    <Bold className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="size-7">
                    <Italic className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="size-7">
                    <Underline className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="size-7">
                    <Quote className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="size-7">
                    <List className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="size-7">
                    <ListOrdered className="size-3.5" />
                </Button>
                <div className="ml-auto">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1.5 text-xs text-muted-foreground"
                    >
                        <Sparkles className="size-3.5" />
                        Ask AI
                    </Button>
                </div>
            </div>
        </div>
    );
}
