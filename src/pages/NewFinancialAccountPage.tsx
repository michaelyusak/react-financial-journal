import React, { useEffect, useState } from 'react'
import type { IBank } from '../interfaces/Bank'
import { useToast } from '../contexts/ToastContext'
import { HandleGet, HandlePost } from '../utils/API'
import type { ICurrency } from '../interfaces/Currency'
import { useNavigate } from 'react-router-dom'

const NewFinancialAccountPage = (): React.ReactElement => {
    const navigate = useNavigate();

    const { addToast } = useToast();

    const [banks, setBanks] = useState<IBank[] | null>(null)
    const [accountName, setAccountName] = useState<string>("")
    const [accountNumber, setAccountNumber] = useState<string>("")
    const [currencies, setCurrencies] = useState<ICurrency[] | null>(null)
    const [selectedBankId, setSelectedBankId] = useState<number | null>(null)
    const [selectedCurrencyId, setSelectedCurrencyId] = useState<number | null>(null)
    const [openingBalance, setOpeningBalance] = useState<number>(0)

    const getBanks = () => {
        const url = import.meta.env.VITE_MAIN_BASE_URL + "/v1/bank"

        HandleGet<IBank[]>(url, true)
            .then((data) => {
                setBanks(data)
            })
            .catch((error) => {
                addToast(`newFinancialAccountPage:failedGetBanks:${Date.now()}`, error.message, false, false, 5000)
            })
    }

    const getCurrencies = () => {
        const url = import.meta.env.VITE_MAIN_BASE_URL + "/v1/currency"

        HandleGet<ICurrency[]>(url, true)
            .then((data) => {
                setCurrencies(data)
            })
            .catch((error) => {
                addToast(`newFinancialAccountPage:failedGetCurrencies:${Date.now()}`, error.message, false, false, 5000)
            })
    }

    function handleSubmit() {
        const url = import.meta.env.VITE_MAIN_BASE_URL + "/v1/financial-account"

        const body = JSON.stringify({
            bank_id: selectedBankId,
            name: accountName,
            number: accountNumber,
            currency_id: selectedCurrencyId,
            opening_balance: openingBalance
        })

        HandlePost(url, body, true)
            .then(() => {
                addToast(`newFinancialAccountPage:successCreateFinancialAccount:${Date.now()}`, "account created", true, false, 5000)
                navigate("/accounts")
            })
            .catch((error) => {
                addToast(`newFinancialAccountPage:failCreateFinancialAccount:${Date.now()}`, error.message, false, false, 5000)
            })

    }

    useEffect(() => {
        if (banks) {
            return
        }

        getBanks()
    }, [])

    useEffect(() => {
        if (currencies) {
            return
        }

        getCurrencies()
    }, [])

    return (
        <>
            <section
                className='
                    h-[calc(100vh-116px)] w-full bg-neutral-primary
                '
            >
                <div
                    className='py-4 px-8 flex flex-col gap-4'
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-semibold text-neutral-dark">
                            Ledgers
                        </h2>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleSubmit()
                        }}
                        className="bg-blue-secondary rounded-xl p-4 text-neutral-bg space-y-4"
                    >
                        <h3 className="text-lg font-semibold">Create Financial Account</h3>

                        {/* Bank */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm opacity-70">Bank</label>
                            <select
                                className="bg-white/10 rounded-md px-3 py-2"
                                value={selectedBankId ?? ""}
                                onChange={(e) => setSelectedBankId(Number(e.target.value))}
                            >
                                <option value="" disabled>
                                    Select a bank
                                </option>
                                {banks?.map((bank) => (
                                    <option key={bank.id} value={bank.id}>
                                        {bank.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Account Identity */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm opacity-70">Account Name</label>
                                <input
                                    type="text"
                                    className="bg-white/10 rounded-md px-3 py-2"
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    placeholder="e.g. Main Savings"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm opacity-70">Account Number</label>
                                <input
                                    type="text"
                                    className="bg-white/10 rounded-md px-3 py-2"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    placeholder="e.g. 1234567890"
                                />
                            </div>
                        </div>

                        {/* Currency & Opening Balance */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm opacity-70">Currency</label>
                                <select
                                    className="bg-white/10 rounded-md px-3 py-2"
                                    value={selectedCurrencyId ?? ""}
                                    onChange={(e) => setSelectedCurrencyId(Number(e.target.value))}
                                >
                                    <option value="" disabled>
                                        Select currency
                                    </option>
                                    {currencies?.map((currency) => (
                                        <option key={currency.id} value={currency.id}>
                                            {currency.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm opacity-70">Opening Balance</label>
                                <input
                                    className="bg-white/10 rounded-md px-3 py-2 text-right"
                                    value={openingBalance.toLocaleString()}
                                    onChange={(e) => {
                                        const raw = e.target.value.replaceAll(",", "")

                                        if (isNaN(+raw)) {
                                            return
                                        }

                                        setOpeningBalance(Number(raw))
                                    }}
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="submit"
                                className="bg-blue-primary text-white rounded-md px-4 py-2 text-sm font-medium"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>

                </div>
            </section>
        </>
    )
}

export default NewFinancialAccountPage