import React, { useEffect, useState } from 'react'
import type { IBalance } from '../interfaces/Balance'
import { HandleGet } from '../utils/API'
import { useToast } from '../contexts/ToastContext'

const Dashboard = (): React.ReactElement => {
    const [balanceList, setBalanceList] = useState<IBalance[]>()

    const { addToast, removeToast } = useToast()

    const getBalanceList = () => {
        const loadingGetBalanceListToastKey = `dashboardPage:loadingGetBalanceList:${Date.now()}`
        addToast(loadingGetBalanceListToastKey, "Fetching balance ...", undefined, false)

        const url = import.meta.env.VITE_MAIN_BASE_URL + "/v1/balance?group_by=financial_account"

        HandleGet<IBalance[]>(url, true)
            .then((data) => {
                removeToast(loadingGetBalanceListToastKey)
                setBalanceList(data)
            })
            .catch((error) => {
                removeToast(loadingGetBalanceListToastKey)
                addToast(`dashboardPage:failedGetBalanceList:${Date.now()}`, error.message, false, false, 5000)
            })
    }

    useEffect(() => {
        if (balanceList) {
            return
        }

        getBalanceList()
    }, [])

    return (
        <>
            <div
                className='h-[calc(100vh-80px)] w-full bg-neutral-light z-[-1]'
            >
                {JSON.stringify(balanceList)}
            </div>
        </>
    )
}

export default Dashboard