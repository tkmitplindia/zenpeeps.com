import { MessageSquare } from 'lucide-react';

// Phase 7 stub — chatroom linked to task
export function TaskDiscussions() {
    return (
        <section>
            <h2 className="mb-2 text-sm font-semibold">Discussions</h2>
            <div className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/30 p-6 text-center">
                <MessageSquare className="size-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                    Task discussions will be available in a future update.
                </p>
            </div>
        </section>
    );
}
