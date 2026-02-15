export interface ILedgerTag {
    id: number;
    tag: string;
    description: string;
    created_at: number;
    updated_at: number;
    deleted_at?: number;
}