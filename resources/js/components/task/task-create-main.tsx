import { router } from '@inertiajs/react';
import { Bold, Italic, List, ListOrdered, Pilcrow, Sparkles, Underline } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { show as boardShow } from '@/routes/boards';
import type { Board } from '@/types';

type Props = {
    board: Board;
    errors: Partial<Record<string, string>>;
    processing: boolean;
};

const TOOLBAR_BUTTONS = [
    { icon: Bold, label: 'Bold' },
    { icon: Italic, label: 'Italic' },
    { icon: Underline, label: 'Underline' },
    { icon: Pilcrow, label: 'Paragraph' },
    { icon: List, label: 'Bullet list' },
    { icon: ListOrdered, label: 'Ordered list' },
] as const;

export function TaskCreateMain({ board, errors, processing }: Props) {
    return (
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto p-6">
            {/* Title */}
            <div className="mb-5">
                <Input
                    name="title"
                    placeholder="Task title"
                    autoFocus
                    required
                    className="h-auto border-0 p-0 text-2xl font-bold shadow-none focus-visible:ring-0"
                />
                {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="rounded-xl border bg-card">
                <div className="min-h-[100px] p-4">
                    <Textarea
                        name="description"
                        placeholder="Add a description..."
                        className="min-h-[80px] resize-none border-0 p-0 text-sm shadow-none focus-visible:ring-0"
                    />
                </div>
                <div className="flex items-center gap-0.5 border-t px-2 py-1.5">
                    {TOOLBAR_BUTTONS.map(({ icon: Icon, label }) => (
                        <Button key={label} type="button" variant="ghost" size="icon" className="size-7 text-muted-foreground" title={label}>
                            <Icon className="size-3.5" />
                        </Button>
                    ))}
                    <div className="ml-auto">
                        <Button type="button" variant="ghost" size="sm" className="h-7 gap-1.5 text-xs text-muted-foreground">
                            <Sparkles className="size-3.5" />
                            Ask AI
                        </Button>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
                <Button type="button" variant="outline" onClick={() => router.visit(boardShow.url(board.id))}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    Create Task
                </Button>
            </div>
        </div>
    );
}
