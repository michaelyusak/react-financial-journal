import type { IFinancialAccount } from "./FinancialAccount";
import type { ILedgerTag } from "./LedgerTag";

export interface ILedger {
    id: number;
    time: number;
    financial_account: IFinancialAccount;
    credit?: number;
    debit?: number;
    note: string;
    ledger_tag: ILedgerTag;
    reference_key: string;
    created_at: number;
    deleted_at?: number;
}