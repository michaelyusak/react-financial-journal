import React, { useEffect, useState } from 'react'
import type { ITransaction } from '../interfaces/transaction'
import { HandleGet } from '../utils/API'
import { useToast } from '../contexts/ToastContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { ITransactionCategory } from '../interfaces/TransactionCategory'

const TransactionPage = (): React.ReactElement => {
    const navigate = useNavigate();

    const isAdmin = location.pathname.includes("/admin/");

    const { addToast } = useToast();
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedCategoryId = searchParams.get("category-id");

    const [transactions, setTransactions] = useState<ITransaction[] | null>(null)
    const [transactionCategories, setTransactionCategories] = useState<ITransactionCategory[] | null>(null)

    const onCategoryChange = (value: string) => {
        const params = new URLSearchParams(searchParams);

        if (value) {
            params.set("category-id", value);
        } else {
            params.delete("category-id");
        }

        setSearchParams(params);
    };


    function getTransactions() {
        const url = import.meta.env.VITE_MAIN_BASE_URL + `/v1/transaction?${selectedCategoryId ? `transaction-category-id=${selectedCategoryId}` : ""}`

        HandleGet<ITransaction[]>(url, true)
            .then((data) => {
                setTransactions(data)
            })
            .catch((error) => {
                addToast(`transactionsPage:failGetTransactions:${Date.now()}`, error.message, false, false, 5000)
            })
    }

    const getTransactionCategories = () => {
        const url = isAdmin ?
            import.meta.env.VITE_MAIN_BASE_URL + "/v1/admin/transaction-category" :
            import.meta.env.VITE_MAIN_BASE_URL + `/v1/transaction-category`

        HandleGet<ITransactionCategory[]>(url, true)
            .then((data) => {
                setTransactionCategories(data)
            })
            .catch((error) => {
                addToast(`transactionsPage:failGetTransactionCategories:${Date.now()}`, error.message, false, false, 5000);
            })
    }

    useEffect(() => {
        getTransactions();
    }, [selectedCategoryId])

    useEffect(() => {
        if (transactionCategories) {
            return
        }

        getTransactionCategories()
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
                            Transactions
                        </h2>
                    </div>

                    <div className="w-full space-y-3">
                        {/* FILTER BAR */}
                        <div className="flex items-center gap-3">
                            <select
                                className="bg-blue-secondary capitalize text-neutral-bg rounded-md px-3 py-2 text-sm"
                                value={selectedCategoryId ?? ""}
                                onChange={(e) => onCategoryChange(e.target.value)}
                            >
                                <option value="">All categories</option>
                                {transactionCategories?.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.category}
                                    </option>
                                ))}
                            </select>

                            {selectedCategoryId && (
                                <button
                                    onClick={() => onCategoryChange("")}
                                    className="text-xs opacity-70 hover:opacity-100"
                                >
                                    Clear filter
                                </button>
                            )}
                        </div>

                        <div className="w-full relative">
                            {/* HEADER TABLE */}
                            <table className="w-full border-collapse table-fixed">
                                <thead>
                                    <tr className="border-b-4 border-blue-primary">
                                        <th className="text-center py-2 px-3">Time</th>
                                        <th className="text-center py-2 px-3">Transaction ID</th>
                                        <th className="text-center py-2 px-3">From</th>
                                        <th className="text-center py-2 px-3">To</th>
                                        <th className="text-center py-2 px-3">Category</th>
                                        <th className="text-center py-2 px-3">Note</th>
                                        <th className="text-center py-2 px-3">Action</th>
                                    </tr>
                                </thead>
                            </table>

                            {/* SCROLLABLE BODY */}
                            <div
                                className="h-[calc(100vh-300px)] overflow-y-auto"
                            >
                                <table className="w-full border-collapse table-fixed">
                                    <tbody>
                                        {transactions && transactions.map((transaction) => (
                                            <tr
                                                onClick={() => navigate(`/transactions/${transaction.id}`)}
                                                key={transaction.id}
                                                className="border-b border-blue-secondary hover:bg-neutral-bg"
                                            >
                                                <td className="py-2 px-3 text-sm text-blue-primary">
                                                    {new Date(transaction.occurred_at * 1000).toLocaleString()}
                                                </td>
                                                <td className="py-2 px-3 text-center">
                                                    {transaction.id}
                                                </td>
                                                <td className="py-2 px-3 text-center capitalize">
                                                    {transaction.participant_from.name}
                                                </td>
                                                <td className="py-2 px-3 text-center capitalize">
                                                    {transaction.participant_to ? transaction.participant_to.name : "-"}
                                                </td>
                                                <td className="py-2 px-3 text-center capitalize">
                                                    {transaction.transaction_category.category}
                                                </td>
                                                <td className="py-2 px-3">
                                                    {transaction.note || "-"}
                                                </td>

                                                <td></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {transactions && transactions.length > 7 && (
                                <span
                                    className='absolute bottom-0 translate-y-full left-1/2 transform -translate-x-1/2
                                    text-sm text-neutral-dark animate-pulse'
                                >
                                    Scroll to view more
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default TransactionPage