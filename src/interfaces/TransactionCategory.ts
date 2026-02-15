export interface ITransactionCategory {
    id: number;
    category: string;
    description: string;
    created_at: number;
    updated_at: number;
    deleted_at?: number;
}

export interface INewTransactionCategory {
    category: string;
    description: string;
}