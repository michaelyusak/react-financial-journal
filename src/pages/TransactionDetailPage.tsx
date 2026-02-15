import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import type { ITransaction } from '../interfaces/transaction';
import { HandleGet, HandlePut } from '../utils/API';
import { useToast } from '../contexts/ToastContext';
import type { IParticipant } from '../interfaces/Participant';
import type { ITransactionCategory } from '../interfaces/TransactionCategory';
import type { ILedger } from '../interfaces/Ledger';
import type { IFinancialAccount } from '../interfaces/FinancialAccount';

const TransactionDetailPage = (): React.ReactElement => {
    const { transaction_id } = useParams<{ transaction_id: string }>();
    const location = useLocation();

    const isAdmin = location.pathname.includes("/admin/");

    const { addToast } = useToast();

    const [transaction, setTransaction] = useState<ITransaction | null>(null)
    const [participants, setParticipants] = useState<IParticipant[] | null>(null)
    const [transactionCategories, setTransactionCategories] = useState<ITransactionCategory[]>()
    const [ledgers, setLedgers] = useState<ILedger[] | null>(null)
    const [financialAccounts, setFinancialAccounts] = useState<IFinancialAccount[] | null>(null)
    const [selectedParticipantToId, setSelectedParticipantToId] = useState<number | null>(null)
    const [selectedParticipantFromId, setSelectedParticipantFromId] = useState<number | null>(null)
    const [selectedTransactionCategoryId, setSelectedTransactionCategoryId] = useState<number | null>(null)
    const [openConfirmUpdate, setOpenConfirmUpdate] = useState<boolean>(false)
    const [note, setNote] = useState<string>("")

    function getTransaction() {
        const url = import.meta.env.VITE_MAIN_BASE_URL + `/v1/transaction/${transaction_id}`

        HandleGet<ITransaction>(url, true)
            .then((data) => {
                setTransaction(data)
                setSelectedParticipantToId(data.participant_to?.id ?? null)
                setSelectedTransactionCategoryId(data.transaction_category.id)
                setSelectedParticipantFromId(data.participant_from.id)
                setNote(data.note)
            })
            .catch((error) => {
                addToast(`transactionDetailPage:failGetTransaction:${Date.now()}`, error.message, false, false, 5000)
            })
    }

    function getParticipants() {
        const url = import.meta.env.VITE_MAIN_BASE_URL + "/v1/participant"

        HandleGet<IParticipant[]>(url, true)
            .then((data) => {
                setParticipants(data)
            })
            .catch((error) => {
                addToast(`transactionDetailPage:failGetParticipants:${Date.now()}`, error.message, false, false, 5000)
            })
    }

    const getTransactionCategories = () => {
        const url = isAdmin ?
            import.meta.env.VITE_MAIN_BASE_URL + "/v1/admin/transaction-category" :
            import.meta.env.VITE_MAIN_BASE_URL + "/v1/transaction-category"

        HandleGet<ITransactionCategory[]>(url, true)
            .then((data) => {
                setTransactionCategories(data)
            })
            .catch((error) => {
                addToast(`transactionDetailPage:failGetTransactionCategories:${Date.now()}`, error.message, false, false, 5000);
            })
    }

    function getLedgers() {
        const url = import.meta.env.VITE_MAIN_BASE_URL + `/v1/transaction/${transaction_id}/ledger`

        HandleGet<ILedger[]>(url, true)
            .then((data) => {
                setLedgers(data)
            })
            .catch((error) => {
                addToast(`transactionDetailPage:failGetLedgers:${Date.now()}`, error.message, false, false, 5000)
            })
    }

    function getFinancialAccounts() {
        const url = import.meta.env.VITE_MAIN_BASE_URL + "/v1/financial-account"

        HandleGet<IFinancialAccount[]>(url, true)
            .then((data) => {
                setFinancialAccounts(data)
            })
            .catch((error) => {
                addToast(`transactionDetailPage:failGetFinancialAccounts:${Date.now()}`, error.message, false, false, 5000)
            })
    }

    function updateTransaction(syncLedger?: boolean) {
        const url = import.meta.env.VITE_MAIN_BASE_URL + `/v1/transaction/${transaction_id}`

        let body = JSON.stringify({
            transaction_category_id: selectedTransactionCategoryId,
            participant_to_id: selectedParticipantToId,
            participant_from_id: selectedParticipantFromId,
            note: note,
            sync_ledgers: syncLedger,
        })

        HandlePut(url, body, true)
            .then(() => {
                getTransaction();

                if (syncLedger) {
                    getLedgers()
                }

                addToast(`transactionDetailPage:successUpdateTransaction:${Date.now()}`, "transaction updated", true, false, 5000)
            })
            .catch((error) => {
                addToast(`transactionDetailPage:failUpdateTransaction:${Date.now()}`, error.message, false, false, 5000)
            })
            .finally(() => {
                setOpenConfirmUpdate(false)
            })
    }

    useEffect(() => {
        if (financialAccounts) {
            return
        }

        getFinancialAccounts()
    }, [])

    useEffect(() => {
        if (ledgers) {
            return
        }

        getLedgers();
    }, [])

    useEffect(() => {
        if (transactionCategories != undefined) {
            return
        }

        getTransactionCategories();
    }, [])

    useEffect(() => {
        if (transaction) {
            return
        }

        getTransaction();
    }, [])

    useEffect(() => {
        if (participants) {
            return
        }

        getParticipants()
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
                            Transaction Detail
                        </h2>
                    </div>

                    <form
                        className="bg-blue-secondary rounded-xl p-4 text-neutral-bg space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Detail</h3>
                            <span className="text-xs opacity-70">
                                ID #{transaction?.id}
                            </span>
                        </div>

                        {/* Meta */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="opacity-70">Occurred at</p>
                                <p className="font-medium">
                                    {transaction && new Date(transaction.occurred_at * 1000).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <p className="opacity-70">Category</p>
                                <select
                                    value={selectedTransactionCategoryId ?? ""}
                                    onChange={(e) => setSelectedTransactionCategoryId(+e.target.value)}
                                    className="w-full capitalize bg-white/10 rounded-md px-2 py-1"
                                >
                                    {transactionCategories?.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Participants */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="opacity-70">From</p>
                                <select
                                    value={selectedParticipantFromId ?? ""}
                                    onChange={(e) => setSelectedParticipantFromId(+e.target.value)}
                                    className="w-full bg-white/10 rounded-md px-2 py-1"
                                >
                                    <option value="">—</option>
                                    {participants?.map((participant) => (
                                        <option
                                            key={participant.id}
                                            value={participant.id}
                                        >
                                            {participant.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <p className="opacity-70">To</p>
                                <select
                                    value={selectedParticipantToId ?? ""}
                                    onChange={(e) => setSelectedParticipantToId(+e.target.value)}
                                    className="w-full bg-white/10 rounded-md px-2 py-1"
                                >
                                    <option value="">—</option>
                                    {participants?.map((participant) => (
                                        <option
                                            key={participant.id}
                                            value={participant.id}
                                        >
                                            {participant.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Note */}
                        <div className="text-sm">
                            <p className="opacity-70">Note</p>
                            <textarea
                                className="w-full bg-white/10 rounded-md px-3 py-2 resize-none"
                                rows={2}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>

                        <div
                            className='flex w-full justify-end gap-5'
                        >
                            <button
                                type='button'
                                onClick={() => getTransaction()}
                                className='px-3 py-1 border border-blue-primary rounded-xl
                                    hover:shadow-xl hover:bg-blue-neutral transition'
                            >
                                Cancel
                            </button>

                            <button
                                type='button'
                                onClick={() => setOpenConfirmUpdate(true)}
                                className='px-3 py-1 border bg-green-400 text-neutral-dark border-blue-primary rounded-xl
                                    hover:shadow-xl hover:bg-green-500 hover:border-blue-muted transition'
                            >
                                Save
                            </button>
                        </div>
                    </form>

                    <div className="bg-blue-secondary rounded-xl p-4 text-neutral-bg space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Ledgers</h3>
                            <span className="text-xs opacity-70">
                                {ledgers?.length || 0} entries
                            </span>
                        </div>

                        <div className="space-y-3">
                            {ledgers?.map((ledger) => {
                                const isIn = Number(ledger.amount) > 0

                                return (
                                    <div
                                        key={ledger.id}
                                        className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
                                    >
                                        {/* Left: Account */}
                                        <div className="flex flex-col gap-1 text-sm w-2/3">
                                            <select
                                                className="bg-transparent border border-white/10 rounded-md px-2 py-1 text-sm"
                                                value={ledger.financial_account.id}
                                            >
                                                {financialAccounts?.map((acc) => (
                                                    <option key={acc.id} value={acc.id}>
                                                        {acc.bank.name} — {acc.name}
                                                    </option>
                                                ))}
                                            </select>

                                            {ledger.note && (
                                                <p className="text-xs opacity-70 truncate">
                                                    {ledger.note}
                                                </p>
                                            )}
                                        </div>

                                        {/* Right: Amount */}
                                        <div className="flex flex-col items-end text-sm w-1/3">
                                            <span
                                                className={`font-semibold ${isIn ? "text-green-400" : "text-red-400"
                                                    }`}
                                            >
                                                {isIn ? "+" : "−"}
                                                {Math.abs(Number(ledger.amount)).toLocaleString()}
                                            </span>

                                            <span className="text-xs opacity-60">
                                                {isIn ? "Inflow" : "Outflow"}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {openConfirmUpdate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setOpenConfirmUpdate(false)}
                        />

                        {/* Modal */}
                        <div className="
                              relative z-10 w-full max-w-md
                              bg-white rounded-lg shadow-lg
                              p-6 flex flex-col gap-4
                            ">
                            <h3 className="text-lg font-semibold text-neutral-900">
                                Sync ledgers?
                            </h3>

                            <p className="text-sm text-neutral-500">
                                Do you want to sync the ledgers with this update?
                                If no ledgers exist yet, they will be created automatically.
                            </p>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={() => setOpenConfirmUpdate(false)}
                                    className="
                                      px-4 py-2 text-sm rounded-md
                                      border border-neutral-300
                                      hover:bg-neutral-100
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => {
                                        updateTransaction(false)
                                    }}
                                    className="
                                      px-4 py-2 text-sm rounded-md
                                      bg-warning text-white
                                      hover:bg-yellow-700
                                      disabled:opacity-50
                                      disabled:cursor-not-allowed
                                    "
                                >
                                    Don't Sync Ledgers
                                </button>

                                <button
                                    onClick={() => {
                                        updateTransaction(true)
                                    }}
                                    className="
                                      px-4 py-2 text-sm rounded-md
                                      bg-success text-white
                                      hover:bg-green-700
                                      disabled:opacity-50
                                      disabled:cursor-not-allowed
                                    "
                                >
                                    Sync Ledger
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    )
}

export default TransactionDetailPage