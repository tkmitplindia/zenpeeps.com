import type { User } from './auth';

export type BoardTemplate =
    | 'custom'
    | 'sprint_plan'
    | 'bug_tracker'
    | 'content_calendar'
    | 'hiring_pipeline'
    | 'product_roadmap';

export type BoardColumn = {
    id: string;
    board_id: string;
    name: string;
    position: number;
    created_at: string;
    updated_at: string;
    tasks?: Task[];
};

export type Task = {
    id: string;
    board_column_id: string;
    board_id: string;
    project_id: string;
    title: string;
    description: string | null;
    position: number;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    due_date: string | null;
    estimate_minutes: number | null;
    elapsed_seconds: number;
    time_tracker_started_at: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
    assignees?: User[];
};

export type Board = {
    id: string;
    project_id: string;
    name: string;
    description: string | null;
    template: BoardTemplate;
    position: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    columns?: BoardColumn[];
    tasks_count?: number;
};
