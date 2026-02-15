import React, { useState, type FormEvent } from 'react'
import type { INewTransactionCategory } from '../interfaces/TransactionCategory'
import { HandlePost } from '../utils/API'
import { useToast } from '../contexts/ToastContext'
import { useLocation, useNavigate } from 'react-router-dom'

const CreateTransactionCategoryPage = (): React.ReactElement => {
    const navigate = useNavigate();
    const location = useLocation();

    const { addToast } = useToast();

    const [newTransactionCategories, setNewTransactionCategories] = useState<INewTransactionCategory[]>([])
    const [bulkText, setBulkText] = useState<string>("")
    const [accountId, setAccountId] = useState<number | null>(null);

    const isAdmin = location.pathname.includes("/admin/");

    function handleAddNewLine() {
        setNewTransactionCategories((prev) => (
            [
                ...prev,
                {
                    category: "",
                    description: "",
                }
            ]
        ))
    }

    function handleAccountIdOnChange(val: string) {
        if (isNaN(+val)) {
            return
        }

        setAccountId(+val)
    }

    function handleRemoveLine(idx: number) {
        setNewTransactionCategories((prev) =>
            prev.filter((_, i) => i !== idx)
        );
    }

    function handleCategoryOnChange(newCategory: string, idx: number) {
        setNewTransactionCategories((prev) =>
            prev.map((item, i) =>
                i === idx ? { ...item, category: newCategory } : item
            )
        );
    }

    function handleDescriptionOnChange(newDescription: string, idx: number) {
        setNewTransactionCategories((prev) =>
            prev.map((item, i) =>
                i === idx ? { ...item, description: newDescription } : item
            )
        );
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const url =
            import.meta.env.VITE_MAIN_BASE_URL +
            (isAdmin ? "/v1/admin/transaction-category" : "/v1/transaction-category");

        const categories = newTransactionCategories.filter(
            (c) => c.category.trim() !== ""
        );

        const requestBody: {
            account_id?: number;
            categories: INewTransactionCategory[];
        } = {
            categories,
            ...(accountId !== null ? { account_id: accountId } : {}),
        };

        const body = JSON.stringify(requestBody)

        HandlePost(url, body, true)
            .then(() => {
                addToast(`createTransactionCategoryPage:successSubmit:${Date.now()}`, "success create transaction categories", true, false, 5000)

                isAdmin ? navigate("/admin/transaction-category") : navigate("/transaction-category")
            })
            .catch((error) => {
                addToast(`createTransactionCategoryPage:failSubmit:${Date.now()}`, error.messsage, false, false, 5000)
            })
    }

    return (
        <>
            <section className="h-[calc(100vh-116px)] w-full bg-neutral-primary">
                <div className="py-4 px-8 flex flex-col gap-6 max-w-5xl">
                    {/* Header */}
                    <div>
                        <h2 className="text-3xl font-semibold text-neutral-dark">
                            Create Transaction Category
                        </h2>
                        <p className="text-sm text-neutral-500 mt-1">
                            Create transaction categories used for journaling and reports.
                        </p>
                    </div>

                    {newTransactionCategories.length < 1 ? (
                        <div className="flex flex-col gap-4">
                            <label className="text-sm font-semibold text-neutral-dark">
                                Transaction Categories (comma, semicolon, or newline separated)
                            </label>

                            <textarea
                                value={bulkText}
                                onChange={(e) => setBulkText(e.target.value)}
                                placeholder={`e.g.\nFood & Drink, Transportation; Housing\nUtilities`}
                                className="w-full h-48 p-3 border rounded-md text-sm
                                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                type="button"
                                onClick={() => {
                                    // Parse bulk text into categories
                                    const parsed = bulkText
                                        .split(/\s*[\n,;]\s*/) // split by newline, comma, or semicolon
                                        .filter(Boolean)
                                        .map((category) => ({
                                            category,
                                            description: "",
                                        }));

                                    setNewTransactionCategories(parsed);
                                }}
                                className="self-start px-4 py-2 bg-blue-600 text-white rounded-md
                                hover:bg-blue-700 transition"
                            >
                                Load Categories
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {isAdmin && (
                                <div
                                    className='w-full flex justify-start gap-10 items-center py-2
                                        text-neutral-700 font-semibold text-sm
                                        '
                                >
                                    <label>
                                        Apply to account with ID
                                    </label>

                                    <input
                                        className='border-b border-neutral-dark'
                                        value={accountId !== null ? accountId : undefined}
                                        placeholder='Account ID'
                                        onChange={(e) => handleAccountIdOnChange(e.target.value)}
                                    >
                                    </input>
                                </div>
                            )}

                            {/* Table-like header */}
                            <div className="grid grid-cols-[2fr_3fr_auto] gap-3 text-sm font-semibold text-neutral-500">
                                <span>Category</span>
                                <span>Description</span>
                                <span></span>
                            </div>

                            {/* Rows */}
                            <div
                                className={`relative flex flex-col gap-2 p-2 border border-blue-primary rounded-2xl 
                                    ${isAdmin ? "h-120" : "h-130"}
                                    overflow-y-auto`}
                            >
                                {newTransactionCategories.map((tc, i) => (
                                    <div
                                        key={i}
                                        className="grid grid-cols-[2fr_3fr_auto] gap-3
                                        items-center p-3 rounded-md
                                        border border-neutral-200
                                        hover:shadow-sm transition"
                                    >
                                        <input
                                            value={tc.category}
                                            placeholder="e.g. Food & Drink"
                                            onChange={(e) => handleCategoryOnChange(e.target.value, i)}
                                            className="px-3 py-2 border rounded-md text-sm
                                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                        <input
                                            value={tc.description}
                                            placeholder="Optional description"
                                            onChange={(e) => handleDescriptionOnChange(e.target.value, i)}
                                            className="px-3 py-2 border rounded-md text-sm
                                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => { i === newTransactionCategories.length - 1 ? handleAddNewLine() : handleRemoveLine(i) }}
                                            className="w-9 h-9 rounded-md
                                            border border-neutral-300
                                            text-lg font-medium
                                            hover:shadow-2xl transition"
                                        >
                                            {i === newTransactionCategories.length - 1 ? "+" : "-"}
                                        </button>
                                    </div>
                                ))}

                                {newTransactionCategories.length > 7 && (
                                    <div
                                        className='absolute bottom-0 left-1/2
                                            transform -translate-x-1/2
                                            text-sm opacity-80 animate-pulse'
                                    >
                                        Scroll to view more
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-md
                                bg-blue-600 text-white text-sm font-medium
                                hover:bg-blue-700 transition"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </section>
        </>
    )
}

export default CreateTransactionCategoryPage