import React, { useEffect, useState } from 'react'
import type { IBalance } from '../interfaces/Balance'
import { HandleGet } from '../utils/API'
import { useToast } from '../contexts/ToastContext'
import { Pie } from 'react-chartjs-2'
import "chart.js/auto"
import { GeneratePieColors } from '../utils/Colors'
import type { ChartOptions } from 'chart.js/auto'

const BalancePage = (): React.ReactElement => {
    const { addToast, removeToast } = useToast()

    const [balanceList, setBalanceList] = useState<IBalance[]>()
    const [pieData, setPieData] = useState<{ labels: string[]; data: number[] }>({
        labels: [],
        data: [],
    })
    const [colors, setColors] = useState<{ base: string[]; hover: string[] }>({
        base: [],
        hover: []
    })

    const getBalanceList = () => {
        const loadingGetBalanceListToastKey = `balancePage:loadingGetBalanceList:${Date.now()}`
        addToast(loadingGetBalanceListToastKey, "Fetching balance ...", undefined, false)

        const url = import.meta.env.VITE_MAIN_BASE_URL + "/v1/balance?group_by=financial_account"

        HandleGet<IBalance[]>(url, true)
            .then((data) => {
                removeToast(loadingGetBalanceListToastKey)
                setBalanceList(data)
            })
            .catch((error) => {
                removeToast(loadingGetBalanceListToastKey)
                addToast(`balancePage:failedGetBalanceList:${Date.now()}`, error.message, false, false, 5000)
            })
    }

    const options: ChartOptions<"pie"> = {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.parsed as number;

                        return `Rp ${value.toLocaleString("id-ID")}`;
                    },
                },
            },
        },
    };

    useEffect(() => {
        if (balanceList) {
            return
        }

        getBalanceList()
    }, [])

    useEffect(() => {
        if (!balanceList) {
            return
        }

        const pieLabels: string[] = []
        const pieData: number[] = []

        balanceList.forEach((balance) => {
            pieLabels.push(balance.label)
            pieData.push(balance.balance)
        })

        setColors(GeneratePieColors(balanceList.length))

        setPieData({
            labels: pieLabels,
            data: pieData,
        })
    }, [balanceList])

    return (
        <>
            <div
                className='h-[calc(100vh-64px)] w-full bg-neutral-primary'
            >
                {
                    pieData && <Pie
                        data={{
                            labels: pieData?.labels,
                            datasets: [
                                {
                                    data: pieData?.data,
                                    backgroundColor: colors.base,
                                    hoverBackgroundColor: colors.hover,
                                },
                            ],
                        }}
                        options={options}
                    />
                }
            </div>
        </>
    )
}

export default BalancePage