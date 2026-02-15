import type { ICurrency } from "./Currency";
import type { IFinancialAccountBreakdown, IFinancialAccountSummary } from "./FinancialAccount";

export interface ICashFlow {
    currency: ICurrency;
    summary: IFinancialAccountSummary;
    breakdown: IFinancialAccountBreakdown;
}