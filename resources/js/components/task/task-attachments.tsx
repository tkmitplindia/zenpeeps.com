import { Paperclip, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Task } from '@/types';

export function TaskAttachments({ task }: { task: Task }) {
    return (
        <section>
            <h2 className="sr-only">Attachments of task {task.title}</h2>
            <h2 className="mb-3 text-sm font-semibold">Attachments</h2>
            <Button
                variant="outline"
                size="sm"
                className="gap-2 text-muted-foreground"
            >
                <Upload className="size-3.5" />
                Add attachment
            </Button>
        </section>
    );
}

export function AttachmentCard({ name, size }: { name: string; size: string }) {
    return (
        <div className="flex flex-col gap-1 rounded-lg border bg-card p-3 text-xs">
            <Paperclip className="size-4 text-muted-foreground" />
            <p className="truncate font-medium">{name}</p>
            <p className="text-muted-foreground">{size}</p>
        </div>
    );
}
