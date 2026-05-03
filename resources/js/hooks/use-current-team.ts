import { usePage } from '@inertiajs/react';
import { Team } from '@/types';

export function useCurrentTeam(): Team {
    const { currentTeam } = usePage<{ currentTeam: Team }>().props;
    return currentTeam;
}
