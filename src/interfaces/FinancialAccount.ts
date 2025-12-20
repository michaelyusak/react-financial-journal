import type { IBank } from "./Bank"
import type { ICurrency } from "./Currency";

export interface IFinancialAccount {
    id: number;
    bank: IBank;
    name: string;
    number: string;
    currency: ICurrency;
    balance: number;
    created_at: number;
    updated_at: number;
    deleted_at?: number;
}

export interface IFinancialAccountSummary {
    cash_in: number;
    cash_out: number;
    net_flow: number;
}

export interface IFinancialAccountBreakdown {
  cash_in_per_tag: Record<string, number>;
  cash_out_per_tag: Record<string, number>;
}

export interface IFinancialAccountRes {
    id: number;
    bank: IBank;
    name: string;
    number: string;
    currency: ICurrency;
    balance: number;
    summary: IFinancialAccountSummary;
    breakdown: IFinancialAccountBreakdown;
    created_at: number;
    updated_at: number;
    deleted_at?: number;
}