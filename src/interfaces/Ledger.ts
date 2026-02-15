import type { IFinancialAccount } from "./FinancialAccount";
import type { ITransaction } from "./transaction";

export interface ILedger {
    id: number;
    transaction: ITransaction;
    financial_account: IFinancialAccount;
    amount: string;            // decimal.Decimal → string (safe for money)
    note: string;
    occurred_at: number;       // unix timestamp
    created_at: number;        // unix timestamp
    deleted_at: number | null; // *int64 → nullable
}
