import { usePage } from '@inertiajs/react';
import type { BoardItemShowPageProps } from '@/types/board';
import { ItemFormAttachments } from './item-form-attachments';
import { ItemFormChecklist } from './item-form-checklist';
import { ItemFormComments } from './item-form-comments';
import { ItemFormDescription } from './item-form-description';
import { ItemFormHeader } from './item-form-header';
import { ItemFormSidebar } from './item-form-sidebar';

export function ItemForm() {
    const { item } = usePage<BoardItemShowPageProps>().props;

    return (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="flex flex-col gap-6">
                <ItemFormHeader item={item} />
                <ItemFormDescription item={item} />
                <ItemFormChecklist item={item} />
                <ItemFormAttachments item={item} />
                <ItemFormComments item={item} />
            </div>

            <ItemFormSidebar item={item} />
        </div>
    );
}
