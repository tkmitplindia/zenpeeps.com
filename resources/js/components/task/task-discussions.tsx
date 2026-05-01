import { MessageSquare, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Task } from '@/types';

export function TaskDiscussions({ task }: { task: Task }) {
    return (
        <section>
            <span className="sr-only">Discussions for {task.title}</span>
            <h2 className="mb-3 text-sm font-semibold">Discussions</h2>

            <div className="rounded-xl border bg-card">
                <Textarea
                    placeholder="Type in your message to join in the conversation..."
                    className="min-h-[72px] resize-none border-0 text-sm shadow-none focus-visible:ring-0"
                    disabled
                />
                <div className="flex items-center gap-0.5 border-t px-2 py-1.5">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1.5 text-xs text-muted-foreground"
                        disabled
                    >
                        <Sparkles className="size-3.5" />
                        Ask AI
                    </Button>
                    <div className="ml-auto">
                        <Button size="icon" className="size-7" disabled>
                            <Send className="size-3.5" />
                        </Button>
                    </div>
                </div>
            </div>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <MessageSquare className="size-3.5" />
                Discussions will be wired in Phase 7.
            </p>
        </section>
    );
}
