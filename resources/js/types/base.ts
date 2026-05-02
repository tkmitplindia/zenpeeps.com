export type Model = {
    id: string;
    created_at: string;
    updated_at: string;
};

export type SoftDeletableModel = Model & {
    deleted_at?: string;
};

export type PaginatedResponse<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};
