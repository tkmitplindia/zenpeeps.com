import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
    CalendarIcon,
    ClockIcon,
    FlagIcon,
    PlayIcon,
    SquareIcon,
    XIcon,
} from 'lucide-react';
import { AppMemberSelect } from '@/components/app-member-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useBoardItemPatch } from '@/hooks/use-board-item-form';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { start, stop } from '@/routes/boards/items/time-tracker';
import type {
    BoardItem,
    BoardItemPriority,
    BoardItemShowPageProps,
} from '@/types/board';

const PRIORITY_OPTIONS: { value: BoardItemPriority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
];

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

function useLiveSeconds(item: BoardItem): number {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (item.time_tracker_started_at === null) {
            return;
        }
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, [item.time_tracker_started_at]);

    if (item.time_tracker_started_at === null) {
        return item.tracked_seconds;
    }
    const startedAt = new Date(item.time_tracker_started_at).getTime();
    return (
        item.tracked_seconds + Math.max(0, Math.floor((now - startedAt) / 1000))
    );
}

export function ItemFormSidebar({ item }: { item: BoardItem }) {
    const { columns, members } = usePage<BoardItemShowPageProps>().props;
    const currentTeam = useCurrentTeam();
    const patch = useBoardItemPatch(item);

    const tags = item.tags ?? [];
    const [tagDraft, setTagDraft] = useState('');

    const onAddTag = () => {
        if (tagDraft.trim() === '') return;
        const next = [...tags.map((t) => t.name), tagDraft.trim()];
        patch({ tags: next });
        setTagDraft('');
    };

    const onRemoveTag = (name: string) => {
        patch({ tags: tags.map((t) => t.name).filter((n) => n !== name) });
    };

    const trackerArgs = {
        current_team: currentTeam.slug,
        board: item.board_id,
        item: item.id,
    };
    const isRunning = item.time_tracker_started_at !== null;
    const liveSeconds = useLiveSeconds(item);
    const estimatedSeconds = (item.estimated_minutes ?? 0) * 60;
    const trackerProgress =
        estimatedSeconds === 0
            ? 0
            : Math.min(100, (liveSeconds / estimatedSeconds) * 100);

    const onToggleTracker = () => {
        const url = isRunning ? stop(trackerArgs).url : start(trackerArgs).url;
        router.post(url, {}, { preserveScroll: true, preserveState: true });
    };

    return (
        <aside className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>Column</Label>
                    <Select
                        value={item.board_column_id}
                        onValueChange={(value) =>
                            patch({ board_column_id: value })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {columns.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label>Priority</Label>
                    <Select
                        value={item.priority}
                        onValueChange={(value) =>
                            patch({ priority: value as BoardItemPriority })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <FlagIcon className="size-4" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PRIORITY_OPTIONS.map((p) => (
                                <SelectItem key={p.value} value={p.value}>
                                    {p.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-2">
                <Label>Assigned To</Label>
                <AppMemberSelect
                    members={members}
                    value={(item.assignees ?? []).map((u) => u.id)}
                    onChange={(value) => patch({ assignees: value })}
                    variant="dropdown"
                />
            </div>

            <div className="grid gap-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 rounded-md border p-2">
                    {tags.map((t) => (
                        <span
                            key={t.id}
                            className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-1 text-xs"
                        >
                            {t.name}
                            <button
                                type="button"
                                onClick={() => onRemoveTag(t.name)}
                                aria-label={`Remove ${t.name}`}
                            >
                                <XIcon className="size-3" />
                            </button>
                        </span>
                    ))}
                    <input
                        value={tagDraft}
                        onChange={(e) => setTagDraft(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                onAddTag();
                            }
                        }}
                        onBlur={onAddTag}
                        placeholder="Add a tag..."
                        className="flex-1 bg-transparent text-sm outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>Due Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="justify-start font-normal"
                            >
                                <CalendarIcon className="size-4" />
                                {item.due_date
                                    ? new Date(
                                          item.due_date,
                                      ).toLocaleDateString(undefined, {
                                          weekday: 'short',
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric',
                                      })
                                    : 'Pick a date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={
                                    item.due_date
                                        ? new Date(item.due_date)
                                        : undefined
                                }
                                onSelect={(date) =>
                                    patch({
                                        due_date: date
                                            ? date.toISOString().slice(0, 10)
                                            : null,
                                    })
                                }
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="grid gap-2">
                    <Label>Estimate (hours)</Label>
                    <Input
                        type="number"
                        min={0}
                        step="0.5"
                        defaultValue={
                            item.estimated_minutes !== null
                                ? item.estimated_minutes / 60
                                : ''
                        }
                        placeholder="e.g. 5"
                        onBlur={(e) => {
                            const value = e.target.value;
                            const minutes =
                                value === ''
                                    ? null
                                    : Math.round(Number(value) * 60);
                            patch({ estimated_minutes: minutes });
                        }}
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <div className="flex items-center justify-between">
                    <Label>Time Tracker</Label>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onToggleTracker}
                    >
                        {isRunning ? (
                            <>
                                <SquareIcon className="size-3" /> End Task
                            </>
                        ) : (
                            <>
                                <PlayIcon className="size-3" /> Start Task
                            </>
                        )}
                    </Button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <ClockIcon className="size-4 text-muted-foreground" />
                    <span>
                        {formatDuration(liveSeconds)}
                        {item.estimated_minutes
                            ? ` elapsed of estimated ${item.estimated_minutes / 60}h`
                            : ' elapsed'}
                    </span>
                </div>
                {item.estimated_minutes !== null && (
                    <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                        <div
                            className="h-full bg-primary transition-[width]"
                            style={{ width: `${trackerProgress}%` }}
                        />
                    </div>
                )}
            </div>
        </aside>
    );
}
