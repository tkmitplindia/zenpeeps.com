import { router } from '@inertiajs/react';
import { PlusIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { destroy, store, update } from '@/routes/boards/items/checklist-items';
import type { BoardItem, BoardItemChecklistItem } from '@/types/board';

export function ItemFormChecklist({ item }: { item: BoardItem }) {
    const currentTeam = useCurrentTeam();
    const checklist = item.checklist_items ?? [];
    const [draft, setDraft] = useState('');

    const completed = checklist.filter((c) => c.completed_at !== null).length;
    const progress =
        checklist.length === 0 ? 0 : (completed / checklist.length) * 100;

    const baseArgs = {
        current_team: currentTeam.slug,
        board: item.board_id,
        item: item.id,
    };

    const addItem = () => {
        if (draft.trim() === '') {
            return;
        }

        router.post(
            store(baseArgs).url,
            { name: draft.trim() },
            {
                preserveScroll: true,
                onSuccess: () => setDraft(''),
            },
        );
    };

    const toggle = (checklistItem: BoardItemChecklistItem) => {
        router.patch(
            update({ ...baseArgs, checklistItem: checklistItem.id }).url,
            { completed: checklistItem.completed_at === null },
            { preserveScroll: true, preserveState: true },
        );
    };

    const remove = (checklistItem: BoardItemChecklistItem) => {
        router.delete(
            destroy({ ...baseArgs, checklistItem: checklistItem.id }).url,
            { preserveScroll: true, preserveState: true },
        );
    };

    return (
        <div className="grid gap-2">
            <div className="flex items-center justify-between">
                <Label>Checklist</Label>
                {checklist.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                        {completed}/{checklist.length} items completed
                    </span>
                )}
            </div>

            {checklist.length > 0 && (
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                        className="h-full bg-primary transition-[width]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            <ul className="divide-y rounded-md border">
                {checklist.map((c) => {
                    const done = c.completed_at !== null;

                    return (
                        <li
                            key={c.id}
                            className="flex items-center gap-3 px-3 py-2"
                        >
                            <Checkbox
                                checked={done}
                                onCheckedChange={() => toggle(c)}
                            />
                            <span
                                className={
                                    done
                                        ? 'flex-1 text-sm text-muted-foreground line-through'
                                        : 'flex-1 text-sm'
                                }
                            >
                                {c.name}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                onClick={() => remove(c)}
                                aria-label="Remove checklist item"
                            >
                                <XIcon className="size-4" />
                            </Button>
                        </li>
                    );
                })}

                <li className="flex items-center gap-2 px-3 py-2">
                    <PlusIcon className="size-4 text-muted-foreground" />
                    <Input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addItem();
                            }
                        }}
                        onBlur={addItem}
                        placeholder="Add task"
                        className="border-0 px-0 shadow-none focus-visible:ring-0"
                    />
                </li>
            </ul>
        </div>
    );
}
