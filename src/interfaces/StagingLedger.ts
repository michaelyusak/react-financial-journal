import type { IFinancialAccount } from "./FinancialAccount";
import type { ITransactionCategory } from "./TransactionCategory";

export interface IStagingLedger {
  id: number;
  financial_account: IFinancialAccount;
  occurred_at: number; // unix timestamp
  amount: string; // decimal.Decimal → string is safest in TS
  note: string;
  transaction_category: ITransactionCategory;
  fingerprint: string;
  exported: boolean;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}
