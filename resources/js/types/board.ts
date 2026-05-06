import type { User } from './auth';
import type { PaginatedResponse, SoftDeletableModel } from './base';
import type { Team } from './teams';

export type BoardStatus = 'active' | 'archived';

export type Board = SoftDeletableModel & {
    name: string;
    description: string | null;
    status: BoardStatus;
    team_id: string;
    created_by_id: string;
    team: Team;
    creator: User;
    columns: BoardColumn[];
    members?: User[];
    members_count?: number;
    columns_count?: number;
    items_count?: number;
};

export type BoardColumn = SoftDeletableModel & {
    name: string;
    order: number;
    board_id: string;
    board?: Board;
    items?: BoardItem[];
};

export type BoardItemPriority = 'low' | 'medium' | 'high' | 'urgent';

export type BoardItem = SoftDeletableModel & {
    board_id: string;
    board_column_id: string;
    created_by: string;
    number: number;
    position: number;
    title: string;
    description: string | null;
    priority: BoardItemPriority;
    estimated_minutes: number | null;
    tracked_seconds: number;
    time_tracker_started_at: string | null;
    due_date: string | null;
    started_at: string | null;
    completed_at: string | null;
    board?: Board;
    column?: BoardColumn;
    creator?: User;
    assignees?: User[];
    tags?: BoardItemTag[];
    attachments?: BoardItemAttachment[];
    comments?: BoardItemComment[];
    checklist_items?: BoardItemChecklistItem[];
};

export type BoardItemTag = {
    id: string;
    board_item_id: string;
    name: string;
    created_at: string;
    updated_at: string;
};

export type BoardItemAttachment = SoftDeletableModel & {
    board_item_id: string;
    uploaded_by: string;
    name: string;
    path: string;
    mime_type: string;
    size: number;
    uploader?: User;
};

export type BoardItemComment = SoftDeletableModel & {
    board_item_id: string;
    user_id: string;
    body: string;
    author?: User;
};

export type BoardItemChecklistItem = SoftDeletableModel & {
    board_item_id: string;
    name: string;
    order: number;
    completed_at: string | null;
};

export type BoardIndexPageProps = {
    boards: PaginatedResponse<Board>;
    filters: {
        search?: string;
        status?: BoardStatus | '';
        sort: string;
        order: string;
    };
    view: 'grid' | 'list';
};

export type BoardItemsIndexPageProps = {
    board: Board;
    members: User[];
    columns: BoardColumn[];
    filters: {
        search?: string;
        sort: string;
        order: string;
    };
    view: 'grid' | 'list';
    items: PaginatedResponse<BoardItem>;
};

export type BoardCreatePageProps = {
    team_members: User[];
};

export type BoardEditPageProps = {
    board: Board;
    team_members: User[];
};

export type BoardItemShowPageProps = {
    board: Board;
    item: BoardItem;
    columns: BoardColumn[];
    members: User[];
};

export type BoardItemCreatePageProps = {
    board: Board;
    columns: BoardColumn[];
    members: User[];
};

export type BoardColumnCreatePageProps = {
    board: Board;
};
