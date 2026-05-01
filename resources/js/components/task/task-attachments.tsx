import { Paperclip, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Phase 6 stub — attachments grid
export function TaskAttachments() {
    return (
        <section>
            <h2 className="mb-2 text-sm font-semibold">Attachments</h2>
            <div className="grid grid-cols-3 gap-2">
                {/* Attachment cards will be rendered here in Phase 6 */}
                <Button
                    variant="outline"
                    className="col-span-3 h-16 gap-2 text-muted-foreground"
                    disabled
                >
                    <UploadCloud className="size-4" />
                    Add attachment
                </Button>
            </div>
        </section>
    );
}

export function AttachmentCard({
    name,
    size,
}: {
    name: string;
    size: string;
}) {
    return (
        <div className="flex flex-col gap-1 rounded-lg border bg-card p-3 text-xs">
            <Paperclip className="size-4 text-muted-foreground" />
            <p className="truncate font-medium">{name}</p>
            <p className="text-muted-foreground">{size}</p>
        </div>
    );
}
