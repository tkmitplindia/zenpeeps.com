import { useRef } from 'react';
import { router } from '@inertiajs/react';
import { PaperclipIcon, UploadIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { destroy, store } from '@/routes/boards/items/attachments';
import type { BoardItem, BoardItemAttachment } from '@/types/board';

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

export function ItemFormAttachments({ item }: { item: BoardItem }) {
    const currentTeam = useCurrentTeam();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const attachments = item.attachments ?? [];

    const baseArgs = {
        current_team: currentTeam.slug,
        board: item.board_id,
        item: item.id,
    };

    const onUpload = (file: File) => {
        router.post(
            store(baseArgs).url,
            { file },
            { preserveScroll: true, forceFormData: true },
        );
    };

    const onRemove = (attachment: BoardItemAttachment) => {
        router.delete(destroy({ ...baseArgs, attachment: attachment.id }).url, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <div className="grid gap-2">
            <Label>Attachments</Label>
            <div className="flex flex-wrap gap-2">
                {attachments.map((a) => (
                    <div
                        key={a.id}
                        className="flex items-center gap-2 rounded-md border bg-card p-2 pr-1 text-sm"
                    >
                        <PaperclipIcon className="size-4 text-muted-foreground" />
                        <div className="flex flex-col">
                            <span className="font-medium">{a.name}</span>
                            <span className="text-xs text-muted-foreground">
                                {formatSize(a.size)}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-6"
                            onClick={() => onRemove(a)}
                            aria-label="Remove attachment"
                        >
                            <XIcon className="size-3.5" />
                        </Button>
                    </div>
                ))}

                <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <UploadIcon /> Add attachment
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            onUpload(file);
                        }
                        e.target.value = '';
                    }}
                />
            </div>
        </div>
    );
}
