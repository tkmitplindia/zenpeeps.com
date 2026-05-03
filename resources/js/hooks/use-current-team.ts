import { usePage } from '@inertiajs/react';
import type { Team } from '@/types';

export function useCurrentTeam(): Team {
    const { currentTeam } = usePage<{ currentTeam: Team }>().props;

    return currentTeam;
}
