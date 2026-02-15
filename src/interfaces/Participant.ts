import type { IFinancialAccount } from "./FinancialAccount";

export interface IParticipant {
    id: number;
    name: string;
    type: "external" | "internal";
    description: string;
    financial_account?: IFinancialAccount;
    created_at: number;
    updated_at: number;
    deleted_at?: number;
}