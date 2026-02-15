import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import type { ILedger } from '../interfaces/Ledger'
import { HandleGet } from '../utils/API'
import { useToast } from '../contexts/ToastContext'

const LedgersPage = (): React.ReactElement => {
    const { addToast } = useToast();

    const [ledgers, setLedgers] = useState<ILedger[] | null>(null)

    function getLedgers() {
        const url = import.meta.env.VITE_MAIN_BASE_URL + `/v1/ledger`

        HandleGet<ILedger[]>(url, true)
            .then((data) => {
                setLedgers(data)
            })
            .catch((error) => {
                addToast(`ledgersPage:failGetLedgers:${Date.now()}`, error.message, false, false, 5000)
            })
    }

    useEffect(() => {
        if (ledgers) {
            return
        }

        getLedgers();
    }, [])

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
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-semibold text-neutral-dark">
                            Ledgers
                        </h2>

                        <NavLink
                            to={"/ledgers/stage"}
                            className="px-4 py-2 rounded-md
                                bg-blue-secondary text-white text-sm font-medium
                                hover:bg-blue-primary hover:shadow-2xl transition"
                        >
                            + Stage
                        </NavLink>
                    </div>

                    <div className="w-full relative">
                        {/* HEADER TABLE */}
                        {/* HEADER TABLE */}
                        <table className="w-full border-collapse table-fixed">
                            <thead>
                                <tr className="border-b-4 border-blue-primary">
                                    <th className="text-left py-2 px-3">Time</th>
                                    <th className="text-left py-2 px-3">Transaction ID</th>
                                    <th className="text-left py-2 px-3">Account</th>
                                    <th className="text-left py-2 px-3">Amount</th>
                                    <th className="text-left py-2 px-3">Note</th>
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
                                                {new Date(ledger.occurred_at * 1000).toLocaleString()}
                                            </td>
                                            <td className="py-2 px-3 text-left uppercase">
                                                {ledger.transaction.id}
                                            </td>
                                            <td className="py-2 px-3 text-left uppercase">
                                                {ledger.financial_account.bank.name} - {ledger.financial_account.name} ({ledger.financial_account.number})
                                            </td>
                                            <td className="py-2 px-3 text-left uppercase">
                                                {`${ledger.financial_account.currency.name} ${Number(ledger.amount).toLocaleString("en-US", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}`}
                                            </td>
                                            <td className="py-2 px-3">
                                                {ledger.note || "-"}
                                            </td>

                                            <td></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {ledgers && ledgers.length > 7 && (
                            <span
                                className='absolute bottom-0 translate-y-full left-1/2 transform -translate-x-1/2
                                    text-sm text-neutral-dark animate-pulse'
                            >
                                Scroll to view more
                            </span>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}

export default LedgersPage