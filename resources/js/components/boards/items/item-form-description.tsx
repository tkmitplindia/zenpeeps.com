import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useBoardItemPatch } from '@/hooks/use-board-item-form';
import type { BoardItem } from '@/types/board';

export function ItemFormDescription({ item }: { item: BoardItem }) {
    const patch = useBoardItemPatch(item);
    const [description, setDescription] = useState(item.description ?? '');

    const commit = () => {
        if (description === (item.description ?? '')) {
            return;
        }
        patch({ description: description === '' ? null : description });
    };

    return (
        <Textarea
            aria-label="Description"
            placeholder="Add a description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={commit}
            rows={4}
            className="resize-none"
        />
    );
}
