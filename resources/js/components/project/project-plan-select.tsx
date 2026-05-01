import { useState } from 'react';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import type { Plan } from '@/types';

const PLAN_META: Record<Plan, { label: string; description: string }> = {
    spark: { label: 'Spark', description: 'For individuals getting started.' },
    basic: { label: 'Basic', description: 'For individuals and small teams.' },
    pro: { label: 'Pro', description: 'For growing businesses.' },
    advanced: {
        label: 'Advanced',
        description: 'For large companies and enterprises.',
    },
};

interface ProjectPlanSelectProps {
    plans: Plan[];
    defaultValue?: Plan;
    error?: string;
}

export function ProjectPlanSelect({
    plans,
    defaultValue,
    error,
}: ProjectPlanSelectProps) {
    const [selected, setSelected] = useState<Plan>(defaultValue ?? plans[0]);

    return (
        <div className="grid gap-2">
            <Label>Plan</Label>
            <RadioGroup
                name="plan"
                defaultValue={selected}
                onValueChange={(value) => setSelected(value as Plan)}
                className="gap-2"
            >
                {plans.map((plan) => {
                    const { label, description } = PLAN_META[plan];

                    return (
                        <Label
                            key={plan}
                            htmlFor={`plan-${plan}`}
                            className={cn(
                                'flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 font-normal transition-colors',
                                selected === plan
                                    ? 'bg-muted'
                                    : 'hover:bg-muted/50',
                            )}
                        >
                            <div>
                                <p className="text-sm font-semibold">{label}</p>
                                <p className="text-sm text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                            <RadioGroupItem id={`plan-${plan}`} value={plan} />
                        </Label>
                    );
                })}
            </RadioGroup>
            <InputError message={error} />
        </div>
    );
}
