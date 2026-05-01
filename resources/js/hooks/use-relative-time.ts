import { formatDistanceToNow } from 'date-fns';

export function useRelativeTime() {
    function relativeTime(date: string): string {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    }

    return { relativeTime };
}
