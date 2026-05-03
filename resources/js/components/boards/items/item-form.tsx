import { usePage } from '@inertiajs/react';
import type { BoardItemShowPageProps } from '@/types/board';
import { ItemFormHeader } from './item-form-header';
import { ItemFormDescription } from './item-form-description';
import { ItemFormChecklist } from './item-form-checklist';
import { ItemFormAttachments } from './item-form-attachments';
import { ItemFormComments } from './item-form-comments';
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
