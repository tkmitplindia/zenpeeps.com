import { Head, setLayoutProps } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import ProjectBillingController from '@/actions/App/Http/Controllers/Settings/ProjectBillingController';
import Heading from '@/components/heading';
import { ProjectPlanSelect } from '@/components/project/project-plan-select';
import { ProjectRecharges } from '@/components/project/recharges';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { billing, show } from '@/routes/projects';
import type {
    Plan,
    PlanDetails,
    Project,
    ProjectLimits,
    RechargePack,
    User,
} from '@/types';

const STATUS_LABELS: Record<string, string> = {
    active: 'Active',
    trial: 'Trial',
    past_due: 'Past due',
    canceled: 'Canceled',
};

const PLAN_LABELS: Record<Plan, string> = {
    spark: 'Spark',
    basic: 'Basic',
    pro: 'Pro',
    advanced: 'Advanced',
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function BillingSettings({
    project,
    limits,
    plans,
    rechargePacks,
    planDetails,
}: {
    project: Project & { owner: User };
    limits: ProjectLimits;
    plans: Plan[];
    rechargePacks: RechargePack[];
    planDetails: PlanDetails;
}) {
    setLayoutProps({
        breadcrumbs: [
            { title: project.name, href: show(project.id) },
            { title: 'Billing', href: billing(project.id) },
        ],
    });

    return (
        <>
            <Head title={`${project.name} · Billing`} />

            <div className="space-y-12">
                <section className="space-y-6">
                    <Heading
                        variant="small"
                        title="Current plan"
                        description="Your active subscription and billing period."
                    />

                    <div className="rounded-lg border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">
                                    {PLAN_LABELS[project.plan]}
                                </span>
                                <Badge variant="secondary">
                                    {STATUS_LABELS[limits.subscription_status] ??
                                        limits.subscription_status}
                                </Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {planDetails.price_cents === 0
                                    ? 'Free'
                                    : `$${(planDetails.price_cents / 100).toFixed(0)}/mo`}
                            </span>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Current period:{' '}
                            {formatDate(limits.current_period_starts_at)} –{' '}
                            {formatDate(limits.current_period_ends_at)}
                        </p>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-3">
                            <span className="text-muted-foreground">
                                Boards:{' '}
                                <span className="text-foreground font-medium">
                                    {planDetails.board_limit === 0
                                        ? 'Unlimited'
                                        : planDetails.board_limit}
                                </span>
                            </span>
                            <span className="text-muted-foreground">
                                AI tokens:{' '}
                                <span className="text-foreground font-medium">
                                    {planDetails.ai_tokens_monthly === 0
                                        ? 'Trial only'
                                        : `${(planDetails.ai_tokens_monthly / 1_000_000).toFixed(0)}M/mo`}
                                </span>
                            </span>
                            <span className="text-muted-foreground">
                                Storage:{' '}
                                <span className="text-foreground font-medium">
                                    {planDetails.storage_bytes / 1_000_000_000} GB
                                </span>
                            </span>
                        </div>
                    </div>
                </section>

                <Separator />

                <section className="space-y-6">
                    <Heading
                        variant="small"
                        title="Change plan"
                        description="Upgrade or downgrade your project plan."
                    />

                    <Form
                        {...ProjectBillingController.update.form(project.id)}
                        options={{ preserveScroll: true }}
                    >
                        {({ processing, errors }) => (
                            <>
                                <ProjectPlanSelect
                                    plans={plans}
                                    defaultValue={project.plan}
                                    error={errors.plan}
                                />

                                <div className="mt-6">
                                    <Button type="submit" disabled={processing}>
                                        {processing && <Spinner />}
                                        Save plan
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </section>

                <Separator />

                <ProjectRecharges project={project} packs={rechargePacks} />
            </div>
        </>
    );
}
