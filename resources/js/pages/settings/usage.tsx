import { Head, Link, setLayoutProps } from '@inertiajs/react';
import Heading from '@/components/heading';
import { billing, show, usage } from '@/routes/projects';
import type { Project, UsageResource, User } from '@/types';

function formatValue(value: number, unit: UsageResource['unit']): string {
    if (unit === 'tokens') {
        if (value >= 1_000_000) {
            return `${(value / 1_000_000).toFixed(1)}M tokens`;
        }

        if (value >= 1_000) {
            return `${(value / 1_000).toFixed(0)}K tokens`;
        }

        return `${value} tokens`;
    }

    if (unit === 'bytes') {
        if (value >= 1_000_000_000) {
            return `${(value / 1_000_000_000).toFixed(1)} GB`;
        }

        if (value >= 1_000_000) {
            return `${(value / 1_000_000).toFixed(0)} MB`;
        }

        return `${(value / 1_000).toFixed(0)} KB`;
    }

    return `${value.toLocaleString()} min`;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function UsageRow({ resource, projectId }: { resource: UsageResource; projectId: string }) {
    const pct =
        resource.total === 0
            ? 0
            : Math.min(100, Math.round((resource.used / resource.total) * 100));

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{resource.label}</span>
                <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">
                        {formatValue(resource.used, resource.unit)} /{' '}
                        {resource.total === 0
                            ? 'Not included'
                            : formatValue(resource.total, resource.unit)}
                    </span>
                    <Link
                        href={`${billing.url(projectId)}#${resource.key}`}
                        className="text-xs text-primary hover:underline shrink-0"
                    >
                        Get more
                    </Link>
                </div>
            </div>

            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                {resource.total > 0 && (
                    <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                    />
                )}
            </div>
        </div>
    );
}

export default function UsageSettings({
    project,
    period,
    resources,
}: {
    project: Project & { owner: User };
    period: { starts_at: string; ends_at: string };
    resources: UsageResource[];
}) {
    setLayoutProps({
        breadcrumbs: [
            { title: project.name, href: show(project.id) },
            { title: 'Usage', href: usage(project.id) },
        ],
    });

    return (
        <>
            <Head title={`${project.name} · Usage`} />

            <div className="space-y-12">
                <section className="space-y-6">
                    <Heading
                        variant="small"
                        title="Usage"
                        description={`Current period: ${formatDate(period.starts_at)} – ${formatDate(period.ends_at)}`}
                    />

                    <div className="space-y-6">
                        {resources.map((resource) => (
                            <UsageRow
                                key={resource.key}
                                resource={resource}
                                projectId={project.id}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
