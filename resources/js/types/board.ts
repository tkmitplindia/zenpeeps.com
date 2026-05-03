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
};

export type BoardColumn = SoftDeletableModel & {
    name: string;
    order: number;
    board_id: string;
    board: Board;
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

export type BoardShowPageProps = {
    board: Board;
    members: User[];
    columns: BoardColumn[];
};

export type BoardCreatePageProps = {
    members: User[];
};

export type BoardEditPageProps = {
    board: Board;
    members: User[];
};
