import type { Auth } from '@/types/auth';
import type { Project } from '@/types/project';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            projects: Project[];
            currentProject: Project | null;
            storage: { used_bytes: number; quota_bytes: number } | null;
            [key: string]: unknown;
        };
    }
}
