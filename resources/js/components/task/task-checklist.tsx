import { router } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    destroyItem,
    storeItem,
    toggleItem,
} from '@/actions/App/Http/Controllers/TaskController';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import type { Task, TaskItem } from '@/types';

type Props = { task: Task; items: TaskItem[] };

export function TaskChecklist({ task, items }: Props) {
    const [newText, setNewText] = useState('');
    const [adding, setAdding] = useState(false);

    const done = items.filter((i) => i.done).length;
    const total = items.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    function handleToggle(item: TaskItem) {
        router.patch(
            toggleItem({ task: task.id, item: item.id }).url,
            {},
            { preserveScroll: true },
        );
    }

    function handleAdd() {
        if (!newText.trim()) {
return;
}

        router.post(
            storeItem(task.id).url,
            { text: newText.trim() },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setNewText('');
                    setAdding(false);
                },
            },
        );
    }

    function handleRemove(item: TaskItem) {
        router.delete(destroyItem({ task: task.id, item: item.id }).url, {
            preserveScroll: true,
        });
    }

    return (
        <section>
            {/* Header row with inline progress */}
            <div className="mb-3 flex items-center gap-3">
                <h2 className="shrink-0 text-sm font-semibold">Checklist</h2>
                {total > 0 && (
                    <>
                        <span className="shrink-0 text-xs text-muted-foreground">
                            {done}/{total} Items completed
                        </span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-green-500 transition-all"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </>
                )}
            </div>

            <ul className="space-y-1">
                {items.map((item) => (
                    <li
                        key={item.id}
                        className="group flex items-center gap-3 rounded-md border bg-card px-3 py-2 text-sm"
                    >
                        <Checkbox
                            checked={item.done}
                            onCheckedChange={() => handleToggle(item)}
                            id={`item-${item.id}`}
                        />
                        <label
                            htmlFor={`item-${item.id}`}
                            className={`flex-1 cursor-pointer ${item.done ? 'text-muted-foreground line-through' : ''}`}
                        >
                            {item.text}
                        </label>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-6 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={() => handleRemove(item)}
                        >
                            <Trash2 className="size-3" />
                        </Button>
                    </li>
                ))}
            </ul>

            {adding ? (
                <div className="mt-2 flex gap-2">
                    <Input
                        autoFocus
                        placeholder="Add a task..."
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
handleAdd();
}

                            if (e.key === 'Escape') {
                                setAdding(false);
                                setNewText('');
                            }
                        }}
                        className="h-8 text-sm"
                    />
                    <Button size="sm" onClick={handleAdd}>
                        Add
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setAdding(false);
                            setNewText('');
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            ) : (
                <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 gap-1.5 text-muted-foreground"
                    onClick={() => setAdding(true)}
                >
                    <Plus className="size-3.5" />
                    Add task
                </Button>
            )}
        </section>
    );
}
