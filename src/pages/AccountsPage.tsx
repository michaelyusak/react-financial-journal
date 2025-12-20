import React, { useEffect, useState } from 'react'
import type { IFinancialAccountRes } from '../interfaces/FinancialAccount'
import { useToast } from '../contexts/ToastContext'
import { HandleGet } from '../utils/API';
import { RiArrowRightLine } from 'react-icons/ri';
import { NavLink } from 'react-router-dom';

const AccountsPage = (): React.ReactElement => {
    const { addToast, removeToast } = useToast();

    const [financialAccountList, setFinancialAccountList] = useState<IFinancialAccountRes[]>()

    const getFinancialAccountList = () => {
        const loadingGetAccountListToastKey = `accountsPage:loadingGetFinancialAccountList:${Date.now()}`
        addToast(loadingGetAccountListToastKey, "Fetching balance ...", undefined, false)

        const url = import.meta.env.VITE_MAIN_BASE_URL + "/v1/financial-account"

        HandleGet<IFinancialAccountRes[]>(url, true)
            .then((data) => {
                removeToast(loadingGetAccountListToastKey)

                setFinancialAccountList(data)
            })
            .catch((error) => {
                removeToast(loadingGetAccountListToastKey);

                addToast(`accountsPage:failGetFinancialAccountList:${Date.now()}`, error.message, false, false, 5000)
            })
    }

    useEffect(() => {
        if (financialAccountList) {
            return
        }

        getFinancialAccountList()
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
                    <h2
                        className='text-3xl font-semibold text-neutral-dark'
                    >
                        Financial Accounts
                    </h2>

                    <div className='flex flex-col w-full h-full justify-between'>
                        <div className='h-170 overflow-y-auto'>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {financialAccountList?.map((account) => (
                                    <div
                                        key={account.id}
                                        className="
                                    relative
                                    p-4 rounded-xl border border-blue-light
                                    bg-blue-muted backdrop-blur
                                    hover:border-blue-primary
                                    transition
                                    text-neutral-light
                                    "
                                    >
                                        {/* Bank */}
                                        <p className="text-md font-semibold">
                                            {account.bank.name}
                                        </p>

                                        {/* Account number */}
                                        <h3 className="text-lg font-semibold tracking-wide text-neutral-dark">
                                            {account.number}
                                        </h3>

                                        {/* Account name */}
                                        <p className="text-sm text-neutral-light">
                                            {account.name}
                                        </p>

                                        <div
                                            className='flex justify-between items-end'
                                        >
                                            <div className='flex gap-3'>
                                                {/* Balance */}
                                                <div className="mt-3">
                                                    <p className="text-xs text-white/50">Balance</p>
                                                    <p className="font-semibold uppercase">
                                                        {account.currency.name}{" "}
                                                        {account.balance.toLocaleString()}
                                                    </p>
                                                </div>

                                                {/* NetFlow */}
                                                <div className="mt-3">
                                                    <p className="text-xs text-white/50">Flow</p>
                                                    <p className={`font-semibold uppercase ${account.summary.net_flow >= 0 ? "text-green-400" : "text-red-400"}`}>
                                                        {account.summary.net_flow > 0 ? "+" : account.summary.net_flow == 0 ? "" : "-"}
                                                        {account.currency.name}{" "}
                                                        {Math.abs(account.summary.net_flow).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <NavLink
                                                to={`/accounts/${account.id}`}
                                                className='
                                                px-1 py-1/2 text-[14px] flex items-center gap-1
                                                border border-blue-muted
                                                hover:border-neutral-light
                                                rounded-md
                                                hover:shadow-[0px_0px_60px_1px_rgba(0,0,0,0.7)]
                                                transition
                                            '
                                            >
                                                See Details
                                                <RiArrowRightLine></RiArrowRightLine>
                                            </NavLink>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div
                            className='w-full flex justify-end'
                        >
                            <NavLink
                                to="/accounts/new"
                                className='bg-blue-primary text-neutral-light px-3 py-1 rounded-md'
                            >
                                New Financial Account
                            </NavLink>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AccountsPage