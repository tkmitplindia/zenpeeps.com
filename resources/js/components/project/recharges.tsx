import { Form } from '@inertiajs/react';
import ProjectRechargeController from '@/actions/App/Http/Controllers/ProjectRechargeController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { Project, RechargePack } from '@/types';

export function ProjectRecharges({
    project,
    packs,
}: {
    project: Project;
    packs: RechargePack[];
}) {
    return (
        <section className="space-y-6">
            <Heading
                variant="small"
                title="Recharge packs"
                description="Extend your allowances or unlock features not included in your plan. Each pack is $5."
            />

            <div className="flex flex-col gap-3">
                {packs.map((pack) => (
                    <Form
                        key={pack.key}
                        {...ProjectRechargeController.store.form(project.id)}
                        options={{ preserveScroll: true }}
                    >
                        {({ processing }) => (
                            <>
                                <input
                                    type="hidden"
                                    name="pack"
                                    value={pack.key}
                                />
                                <div id={pack.key} className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {pack.label}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            $
                                            {(pack.price_cents / 100).toFixed(
                                                2,
                                            )}
                                        </p>
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="outline"
                                        size="sm"
                                        disabled={processing}
                                    >
                                        {processing && <Spinner />}
                                        Purchase
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                ))}
            </div>
        </section>
    );
}
