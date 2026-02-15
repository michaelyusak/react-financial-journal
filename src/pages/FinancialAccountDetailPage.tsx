import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { HandleGet } from '../utils/API';
import { type IFinancialAccountDetail } from '../interfaces/FinancialAccount';
import { useToast } from '../contexts/ToastContext';

const FinancialAccountDetailPage = (): React.ReactElement => {
    const { financial_account_id } = useParams<{ financial_account_id: string }>();
    const navigate = useNavigate();

    const [breakdownMode, setBreakdownMode] = useState<"in" | "out">("out");
    const [financialAccountDetail, setFinancialAccountDetail] = useState<IFinancialAccountDetail | null>(null)

    const { addToast, removeToast } = useToast();

    const getFinancialAccountDetail = () => {
        const loadingGetLedgersToastKey = `financialAccountDetailPage:loadingGetFinancialAccountDetail:${Date.now()}`
        addToast(loadingGetLedgersToastKey, "fetching details ...", undefined, false)

        const url = import.meta.env.VITE_MAIN_BASE_URL + `/v1/financial-account/${financial_account_id}`

        HandleGet<IFinancialAccountDetail>(url, true)
            .then((data) => {
                removeToast(loadingGetLedgersToastKey)

                setFinancialAccountDetail(data)
            })
            .catch((error) => {
                removeToast(loadingGetLedgersToastKey)
                addToast(`financialAccountDetailPage:failGetFinancialAccountDetail:${Date.now()}`, error.message, false, false, 5000)
            })
    }

    useEffect(() => {
        if (financialAccountDetail) {
            return
        }

        getFinancialAccountDetail();
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
                              w-full max-w-100
                              bg-blue-primary rounded-3xl
                              p-6 text-neutral-light
                              flex flex-col gap-4
                            "
                        >
                            {/* Account title */}
                            {financialAccountDetail ? (
                                <h3 className="text-xl font-semibold leading-snug">
                                    {financialAccountDetail.financial_account.bank.name} — {financialAccountDetail.financial_account.name}
                                </h3>
                            ) : (
                                <div className="h-6 w-3/4 bg-blue-muted rounded-md animate-pulse" />
                            )}

                            {/* Account number */}
                            {financialAccountDetail ? (
                                <p className="text-sm tracking-wide opacity-80">
                                    {financialAccountDetail.financial_account.number}
                                </p>
                            ) : (
                                <div className="h-4 w-1/2 bg-blue-muted rounded-md animate-pulse" />
                            )}

                            {/* Divider */}
                            <div className="h-px bg-white/20 my-2" />

                            {/* Balance row */}
                            <div className="flex items-center justify-between">
                                <p className="text-sm opacity-80">Balance</p>

                                {financialAccountDetail ? (
                                    <p className="text-lg font-semibold uppercase">
                                        {financialAccountDetail.financial_account.currency.name}{" "}
                                        {Number(financialAccountDetail.financial_account.balance).toLocaleString()}
                                    </p>
                                ) : (
                                    <div className="h-5 w-32 bg-blue-muted rounded-md animate-pulse" />
                                )}
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-white/20 w-full" />

                            {/* Summary */}
                            {financialAccountDetail && financialAccountDetail.insight.summary ? (
                                <div className='flex flex-col w-full gap-4'>
                                    <div className="flex w-full justify-between px-10 gap-4 text-sm">
                                        <div
                                            className='flex flex-col justify-center items-center'
                                        >
                                            <p className="opacity-70">Cash In</p>
                                            <p className="font-semibold text-green-400 uppercase text-center">
                                                +{financialAccountDetail.financial_account.currency.name}{" "}
                                                {Number(financialAccountDetail.insight.summary.cash_in).toLocaleString()}
                                            </p>
                                        </div>

                                        <div
                                            className='flex flex-col justify-center items-center'
                                        >
                                            <p className="opacity-70">Cash Out</p>
                                            <p className="font-semibold text-red-400 uppercase text-center">
                                                −{financialAccountDetail.financial_account.currency.name}{" "}
                                                {Number(financialAccountDetail.insight.summary.cash_out).toLocaleString()}
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
                                                ${financialAccountDetail.insight.summary.net_flow >= 0 ? "text-green-400" : "text-red-400"}
                                            `}
                                        >
                                            {financialAccountDetail.insight.summary.net_flow > 0 ? "+" : financialAccountDetail.insight.summary.net_flow == 0 ? "" : "-"}
                                            {financialAccountDetail.financial_account.currency.name}{" "}
                                            {Math.abs(financialAccountDetail.insight.summary.net_flow).toLocaleString()}
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
                            {financialAccountDetail && financialAccountDetail.insight.breakdown ? (
                                (
                                    (breakdownMode === "in" &&
                                        Object.keys(financialAccountDetail.insight.breakdown.cash_in_per_tag).length > 0) ||
                                    (breakdownMode === "out" &&
                                        Object.keys(financialAccountDetail.insight.breakdown.cash_out_per_tag).length > 0)
                                ) ? (
                                    <div
                                        className='flex flex-col justify-center items-center'
                                    >
                                        <div className="max-h-40 overflow-y-auto w-full flex flex-col gap-2 pr-1">
                                            {Object.entries(
                                                breakdownMode === "out"
                                                    ? financialAccountDetail.insight.breakdown.cash_out_per_tag
                                                    : financialAccountDetail.insight.breakdown.cash_in_per_tag
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
                                                        {financialAccountDetail.financial_account.currency.name}{" "}
                                                        {Number(amount).toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {Object.entries(
                                            breakdownMode === "out"
                                                ? financialAccountDetail.insight.breakdown.cash_out_per_tag
                                                : financialAccountDetail.insight.breakdown.cash_in_per_tag
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
                                            <th className="text-center w-[12%] py-2">Time</th>
                                            <th className="text-center w-[15%] py-2">Transaction ID</th>
                                            <th className="text-center w-[20%] py-2">Account</th>
                                            <th className="text-center w-[23%] py-2">Amount</th>
                                            <th className="text-center w-[20%] py-2">Note</th>
                                            <th className="text-center w-[10%] py-2">Action</th>
                                        </tr>
                                    </thead>
                                </table>

                                {/* SCROLLABLE BODY */}
                                <div
                                    className="h-[calc(100vh-300px)] overflow-y-auto"
                                >
                                    <table className="w-full border-collapse table-fixed">
                                        <tbody>
                                            {financialAccountDetail && financialAccountDetail.ledgers.map((ledger) => (
                                                <tr
                                                    onClick={() => navigate(`/transactions/${ledger.transaction.id}`)}
                                                    key={ledger.id}
                                                    className="border-b border-blue-secondary hover:bg-neutral-bg"
                                                >
                                                    <td className="text-center py-2 px-3 w-[12%] text-sm text-blue-primary">
                                                        {new Date(ledger.occurred_at * 1000).toLocaleString()}
                                                    </td>
                                                    <td className="text-center py-2 px-3 w-[15%] uppercase">
                                                        {ledger.transaction.id}
                                                    </td>
                                                    <td className="text-center py-2 px-3 w-[20%] uppercase">
                                                        {ledger.financial_account.bank.name} - {ledger.financial_account.name} ({ledger.financial_account.number})
                                                    </td>
                                                    <td className="text-center py-2 px-3 w-[23%] uppercase">
                                                        {`${ledger.financial_account.currency.name} ${Number(ledger.amount).toLocaleString()}`}
                                                    </td>
                                                    <td className="text-center py-2 px-3 w-[20%]">
                                                        {ledger.note || "-"}
                                                    </td>

                                                    <td className='text-center w-[10%]'
                                                    ></td>
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