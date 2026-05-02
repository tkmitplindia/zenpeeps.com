import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type Props = {
    name?: string;
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    className?: string;
};

export function DatePicker({
    name,
    value,
    onChange,
    placeholder = 'Pick a date',
    className,
}: Props) {
    const [date, setDate] = useState<Date | undefined>(value);

    function handleSelect(selected: Date | undefined) {
        setDate(selected);
        onChange?.(selected);
    }

    return (
        <>
            {name && (
                <input
                    type="hidden"
                    name={name}
                    value={date ? format(date, 'yyyy-MM-dd') : ''}
                />
            )}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        data-empty={!date}
                        className={cn(
                            'h-9 w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground',
                            className,
                        )}
                    >
                        <CalendarIcon className="size-4 shrink-0" />
                        {date ? format(date, 'PPP') : <span>{placeholder}</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleSelect}
                    />
                </PopoverContent>
            </Popover>
        </>
    );
}
