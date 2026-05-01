import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

type Props = {
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
};

export function ListInput({ value, onChange, placeholder = 'Add…' }: Props) {
    function remove(index: number) {
        onChange(value.filter((_, i) => i !== index));
    }

    function add(item: string) {
        const trimmed = item.trim();
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed]);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            e.preventDefault();
            add(e.currentTarget.value);
            e.currentTarget.value = '';
        }
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        if (e.target.value.trim()) {
            add(e.target.value);
            e.target.value = '';
        }
    }

    return (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 min-h-[44px]">
            {value.map((item, i) => (
                <Badge key={i} variant="secondary" className="gap-1 pr-1">
                    {item}
                    <button
                        type="button"
                        onClick={() => remove(i)}
                        className="ml-0.5 rounded hover:bg-muted"
                        aria-label={`Remove ${item}`}
                    >
                        <X className="size-3" />
                    </button>
                </Badge>
            ))}
            <Input
                className="h-auto border-0 shadow-none focus-visible:ring-0 p-0 w-32 text-sm placeholder:text-muted-foreground"
                placeholder={placeholder}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
            />
        </div>
    );
}
