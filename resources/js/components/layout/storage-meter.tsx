import { Link, usePage } from '@inertiajs/react';
import { HardDrive } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useSidebar } from '@/components/ui/sidebar';
import { usage } from '@/routes/projects';

function formatBytes(bytes: number): string {
    if (bytes >= 1024 * 1024 * 1024) {
        return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    }

    if (bytes >= 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    return (bytes / 1024).toFixed(0) + ' KB';
}

export function StorageMeter() {
    const { storage, currentProject } = usePage().props;
    const { state } = useSidebar();

    if (!storage || !currentProject) {
        return null;
    }

    const percent = Math.min(
        100,
        Math.round((storage.used_bytes / storage.quota_bytes) * 100),
    );
    const isCollapsed = state === 'collapsed';

    return (
        <Link
            href={usage.url(currentProject.id)}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-xs text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            title={`${formatBytes(storage.used_bytes)} / ${formatBytes(storage.quota_bytes)}`}
        >
            <HardDrive className="size-4 shrink-0" />
            {!isCollapsed && (
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex justify-between">
                        <span className="truncate">Storage</span>
                        <span className="shrink-0 tabular-nums">
                            {formatBytes(storage.used_bytes)} /{' '}
                            {formatBytes(storage.quota_bytes)}
                        </span>
                    </div>
                    <Progress value={percent} className="h-1" />
                </div>
            )}
        </Link>
    );
}
