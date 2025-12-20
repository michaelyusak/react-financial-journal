import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import type { ILedger } from '../interfaces/Ledger';
import { HandleGet } from '../utils/API';
import type { IFinancialAccountRes } from '../interfaces/FinancialAccount';
import { useToast } from '../contexts/ToastContext';

const FinancialAccountDetailPage = (): React.ReactElement => {
    const { financial_account_id } = useParams<{ financial_account_id: string }>();

    const [ledgers, setLedgers] = useState<ILedger[]>();
    const [financialAccount, setFinancialAccount] = useState<IFinancialAccountRes>();
    const [breakdownMode, setBreakdownMode] = useState<"in" | "out">("out");

    const { addToast, removeToast } = useToast();

    const getLedgers = () => {
        const loadingGetLedgersToastKey = `financialAccountDetailPage:loadingGetLedgers:${Date.now()}`
        addToast(loadingGetLedgersToastKey, "Fetching ledgers ...", undefined, false)

        const url = import.meta.env.VITE_MAIN_BASE_URL + `/v1/financial-account/${financial_account_id}/ledger`

        HandleGet<{ ledgers: ILedger[], financial_account: IFinancialAccountRes }>(url, true)
            .then((data) => {
                removeToast(loadingGetLedgersToastKey)

                setLedgers(data.ledgers)
                setFinancialAccount(data.financial_account)
            })
            .catch((error) => {
                removeToast(loadingGetLedgersToastKey)
                addToast(`financialAccountDetailPage:failGetLedgers:${Date.now()}`, error.message, false, false, 5000)
            })
    }

    useEffect(() => {
        if (ledgers && financialAccount) {
            return
        }

        getLedgers();
    }, [financial_account_id])

    return (
        <>
            <section
                className='
                    h-[calc(100vh-116px)] w-full bg-neutral-primary
                '
            >
                <div
                    className='py-4 px-8 flex flex-col gap-4 w-full h-full'
                >
                    <h2
                        className='text-3xl font-semibold text-neutral-dark'
                    >
                        Account Details
                    </h2>

                    <div
                        className='w-full h-full flex justify-between gap-10'
                    >
                        <div
                            className="
                              w-full max-w-md
                              bg-blue-primary rounded-3xl
                              p-6 text-neutral-light
                              flex flex-col gap-4
                            "
                        >
                            {/* Account title */}
                            {financialAccount ? (
                                <h3 className="text-xl font-semibold leading-snug">
                                    {financialAccount.bank.name} — {financialAccount.name}
                                </h3>
                            ) : (
                                <div className="h-6 w-3/4 bg-blue-muted rounded-md animate-pulse" />
                            )}

                            {/* Account number */}
                            {financialAccount ? (
                                <p className="text-sm tracking-wide opacity-80">
                                    {financialAccount.number}
                                </p>
                            ) : (
                                <div className="h-4 w-1/2 bg-blue-muted rounded-md animate-pulse" />
                            )}

                            {/* Divider */}
                            <div className="h-px bg-white/20 my-2" />

                            {/* Balance row */}
                            <div className="flex items-center justify-between">
                                <p className="text-sm opacity-80">Balance</p>

                                {financialAccount ? (
                                    <p className="text-lg font-semibold uppercase">
                                        {financialAccount.currency.name}{" "}
                                        {financialAccount.balance.toLocaleString()}
                                    </p>
                                ) : (
                                    <div className="h-5 w-32 bg-blue-muted rounded-md animate-pulse" />
                                )}
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-white/20 w-full" />

                            {/* Summary */}
                            {financialAccount && financialAccount.summary ? (
                                <div className='flex flex-col w-full gap-4'>
                                    <div className="flex w-full justify-between px-10 gap-4 text-sm">
                                        <div
                                            className='flex flex-col justify-center items-center'
                                        >
                                            <p className="opacity-70">Cash In</p>
                                            <p className="font-semibold text-green-400 uppercase text-center">
                                                +{financialAccount.currency.name}{" "}
                                                {financialAccount.summary.cash_in.toLocaleString()}
                                            </p>
                                        </div>

                                        <div
                                            className='flex flex-col justify-center items-center'
                                        >
                                            <p className="opacity-70">Cash Out</p>
                                            <p className="font-semibold text-red-400 uppercase text-center">
                                                −{financialAccount.currency.name}{" "}
                                                {financialAccount.summary.cash_out.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className='flex flex-col justify-center items-center'
                                    >
                                        <p className="opacity-70">Net</p>
                                        <p
                                            className={`
                                                font-semibold uppercase text-center 
                                                ${financialAccount.summary.net_flow >= 0 ? "text-green-400" : "text-red-400"}
                                            `}
                                        >
                                            {financialAccount.summary.net_flow > 0 ? "+" : financialAccount.summary.net_flow == 0 ? "" : "-"}
                                            {financialAccount.currency.name}{" "}
                                            {Math.abs(financialAccount.summary.net_flow).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-16 bg-blue-muted rounded-md animate-pulse" />
                            )}

                            {/* Divider */}
                            <div className="h-px bg-white/20" />

                            {/* Breakdown header */}
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Breakdown</p>

                                <div className="flex rounded-lg bg-white/10 p-1 text-xs">
                                    <button
                                        onClick={() => setBreakdownMode("out")}
                                        className={`px-3 py-1 rounded-md transition ${breakdownMode === "out"
                                            ? "bg-white text-blue-primary"
                                            : "opacity-70 hover:opacity-100"
                                            }`}
                                    >
                                        Cash Out
                                    </button>

                                    <button
                                        onClick={() => setBreakdownMode("in")}
                                        className={`px-3 py-1 rounded-md transition ${breakdownMode === "in"
                                            ? "bg-white text-blue-primary"
                                            : "opacity-70 hover:opacity-100"
                                            }`}
                                    >
                                        Cash In
                                    </button>
                                </div>
                            </div>

                            {/* Breakdown list */}
                            {financialAccount && financialAccount.breakdown ? (
                                (
                                    (breakdownMode === "in" &&
                                        Object.keys(financialAccount.breakdown.cash_in_per_tag).length > 0) ||
                                    (breakdownMode === "out" &&
                                        Object.keys(financialAccount.breakdown.cash_out_per_tag).length > 0)
                                ) ? (
                                    <div
                                        className='flex flex-col justify-center items-center'
                                    >
                                        <div className="max-h-40 overflow-y-auto w-full flex flex-col gap-2 pr-1">
                                            {Object.entries(
                                                breakdownMode === "out"
                                                    ? financialAccount.breakdown.cash_out_per_tag
                                                    : financialAccount.breakdown.cash_in_per_tag
                                            ).map(([tag, amount]) => (
                                                <div
                                                    key={tag}
                                                    className="flex items-center justify-between text-sm"
                                                >
                                                    <span className="opacity-80 capitalize">{tag}</span>

                                                    <span
                                                        className={`font-medium uppercase text-center ${breakdownMode === "out" ? "text-red-400" : "text-green-400"
                                                            }`}
                                                    >
                                                        {financialAccount.currency.name}{" "}
                                                        {amount.toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {Object.entries(
                                            breakdownMode === "out"
                                                ? financialAccount.breakdown.cash_out_per_tag
                                                : financialAccount.breakdown.cash_in_per_tag
                                        ).length > 6 ? (
                                            <p
                                                className='text-xs h-0.5 animate-pulse'
                                            >
                                                Scroll to load more
                                            </p>
                                        ) : (
                                            <div className='h-0.5'></div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-24 text-sm font-medium text-center">
                                        No cash {breakdownMode} history yet.
                                    </div>
                                )
                            ) : (
                                <div className="h-24 bg-blue-muted rounded-md animate-pulse" />
                            )}
                        </div>

                        <div
                            className='flex-1 flex flex-col gap-2'
                        >
                            <h3
                                className='text-2xl font-semibold'
                            >
                                Ledgers
                            </h3>

                            <div className="w-full">
                                {/* HEADER TABLE */}
                                <table className="w-full border-collapse table-fixed">
                                    <thead>
                                        <tr className="border-b-4 border-blue-primary">
                                            <th className="text-left py-2 px-3">Time</th>
                                            <th className="text-left py-2 px-3">Credit</th>
                                            <th className="text-left py-2 px-3">Debit</th>
                                            <th className="text-left py-2 px-3">Note</th>
                                            <th className="text-left py-2 px-3">Tag</th>
                                            <th className="text-left py-2 px-3">Action</th>
                                        </tr>
                                    </thead>
                                </table>

                                {/* SCROLLABLE BODY */}
                                <div
                                    className="h-[calc(100vh-300px)] overflow-y-auto"
                                >
                                    <table className="w-full border-collapse table-fixed">
                                        <tbody>
                                            {ledgers?.map((ledger) => (
                                                <tr
                                                    key={ledger.id}
                                                    className="border-b border-blue-secondary hover:bg-neutral-bg"
                                                >
                                                    <td className="py-2 px-3 text-sm text-blue-primary">
                                                        {new Date(ledger.time * 1000).toLocaleString()}
                                                    </td>
                                                    <td className="py-2 px-3 text-left uppercase">
                                                        {ledger.credit
                                                            ? `${financialAccount?.currency.name} ${ledger.credit.toLocaleString()}`
                                                            : "-"}
                                                    </td>
                                                    <td className="py-2 px-3 text-left uppercase">
                                                        {ledger.debit
                                                            ? `${financialAccount?.currency.name} ${ledger.debit.toLocaleString()}`
                                                            : "-"}
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        {ledger.note || "-"}
                                                    </td>
                                                    <td className="py-2 px-3 capitalize">
                                                        {ledger.ledger_tag?.tag ?? "-"}
                                                    </td>

                                                    <td>

                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default FinancialAccountDetailPage