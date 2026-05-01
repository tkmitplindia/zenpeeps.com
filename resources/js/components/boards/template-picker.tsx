import type { BoardTemplate } from '@/types';

const TEMPLATE_COLUMNS: Record<BoardTemplate, string[]> = {
    custom: ['Backlog', 'In Progress', 'In Review', 'Done'],
    sprint_plan: ['Backlog', 'Sprint', 'In Progress', 'In Review', 'Done'],
    bug_tracker: ['Reported', 'Triaged', 'In Progress', 'Fixed', 'Closed'],
    content_calendar: ['Ideas', 'Writing', 'Review', 'Scheduled', 'Published'],
    hiring_pipeline: ['Applied', 'Screen', 'Interview', 'Offer', 'Hired'],
    product_roadmap: ['Discovery', 'Planned', 'In Progress', 'Launched'],
};

export function getDefaultColumns(template: BoardTemplate): string[] {
    return TEMPLATE_COLUMNS[template] ?? TEMPLATE_COLUMNS.custom;
}

const TEMPLATE_LABELS: Record<BoardTemplate, string> = {
    custom: 'Custom',
    sprint_plan: 'Sprint Plan',
    bug_tracker: 'Bug Tracker',
    content_calendar: 'Content Calendar',
    hiring_pipeline: 'Hiring Pipeline',
    product_roadmap: 'Product Roadmap',
};

type Props = {
    templates: BoardTemplate[];
    selected: BoardTemplate;
    onChange: (template: BoardTemplate) => void;
};

export function TemplatePicker({ templates, selected, onChange }: Props) {
    return (
        <div className="flex flex-wrap gap-2">
            {templates.map((t) => (
                <label key={t} className="cursor-pointer">
                    <input
                        type="radio"
                        name="template"
                        value={t}
                        checked={selected === t}
                        onChange={() => onChange(t)}
                        className="sr-only"
                    />
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
                            selected === t
                                ? 'border-primary bg-primary/5 text-primary font-medium'
                                : 'border-border hover:bg-muted'
                        }`}
                    >
                        <span
                            className={`size-2 rounded-full border ${
                                selected === t ? 'bg-primary border-primary' : 'border-muted-foreground'
                            }`}
                        />
                        {TEMPLATE_LABELS[t]}
                    </span>
                </label>
            ))}
        </div>
    );
}
