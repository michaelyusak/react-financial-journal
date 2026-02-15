import React, { useEffect, useState } from 'react'
import type { ITransactionCategory } from '../interfaces/TransactionCategory'
import { HandleGet } from '../utils/API'
import { useToast } from '../contexts/ToastContext'
import { NavLink, useLocation } from 'react-router-dom'

const TransactionCategoryPage = (): React.ReactElement => {
    const { addToast } = useToast();
    const location = useLocation();

    const [transactionCategories, setTransactionCategories] = useState<ITransactionCategory[]>()

    const isAdmin = location.pathname.includes("/admin/");

    const getTransactionCategories = () => {
        const url =  isAdmin ?
            import.meta.env.VITE_MAIN_BASE_URL + "/v1/admin/transaction-category" : 
            import.meta.env.VITE_MAIN_BASE_URL + "/v1/transaction-category"

        HandleGet<ITransactionCategory[]>(url, true)
            .then((data) => {
                setTransactionCategories(data)
            })
            .catch((error) => {
                addToast(`transactionCategoryPage:failGetTransactionCategories:${Date.now()}`, error.message, false, false, 5000);
            })
    }

    useEffect(() => {
        if (transactionCategories != undefined) {
            return
        }

        getTransactionCategories();
    }, [])

    return (
        <>
            <section className="h-[calc(100vh-116px)] w-full bg-neutral-primary">
                <div
                    className='py-4 px-8 flex flex-col gap-4'
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-semibold text-neutral-dark">
                            Transaction Categories
                        </h2>

                        <NavLink
                            to={isAdmin ? "/admin/transaction-category/create" : "/transaction-category/create"}
                            className="px-4 py-2 rounded-md
                                bg-blue-secondary text-white text-sm font-medium
                                hover:bg-blue-primary hover:shadow-2xl transition"
                        >
                            + Create Category
                        </NavLink>
                    </div>

                    {/* List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {transactionCategories?.map((tc) => (
                            <div
                                key={tc.category}
                                className="rounded-lg border border-neutral-200
                                    bg-white p-4
                                    hover:shadow-md transition"
                            >
                                {/* Title */}
                                <div className="text-lg font-semibold text-neutral-800">
                                    {tc.category}
                                </div>

                                {/* Description */}
                                <div className="mt-1 text-sm text-neutral-600">
                                    {tc.description || "No description"}
                                </div>

                                {/* Meta */}
                                <div className="mt-4 flex justify-between text-xs text-neutral-400">
                                    <span>Created: {tc.created_at}</span>
                                    <span>Updated: {tc.updated_at}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default TransactionCategoryPage