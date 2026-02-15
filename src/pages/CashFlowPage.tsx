import React, { useEffect, useState } from 'react'
import type { ICashFlow } from '../interfaces/Reports'
import { HandleGet } from '../utils/API'
import { useToast } from '../contexts/ToastContext'

const CashFlowPage = (): React.ReactElement => {
    const { addToast } = useToast();

    const [cashFlow, setCashFlow] = useState<ICashFlow[] | null>(null)
    const [breakdownMode, setBreakdownMode] = useState<"in" | "out">("in")

    const formatAmount = (value?: number) =>
        value !== undefined ? Number(value).toLocaleString() : "—"

    const flowColor = (value?: number) =>
        value && value > 0 ? "text-green-400" : "text-red-400"


    function getCashFlow() {
        const url = import.meta.env.VITE_MAIN_BASE_URL + "/v1/reports/cash-flow"

        HandleGet<ICashFlow[]>(url, true)
            .then((data) => {
                setCashFlow(data)
            })
            .catch((error) => {
                addToast(`cashFlowPage:failGetCashFlow:${Date.now()}`, error.message, false, false, 5000)
            })
    }

    useEffect(() => {
        if (cashFlow) {
            return
        }

        getCashFlow()
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
                            Cash Flow
                        </h2>
                    </div>

                    <div className="bg-blue-secondary rounded-xl w-full text-neutral-bg p-4 space-y-6 flex justify-between">
                        {/* ===== Summary ===== */}
                        <section>
                            <h3 className="text-sm font-semibold opacity-80 mb-3">Summary</h3>

                            {cashFlow?.map((report) => (
                                <div
                                    key={report.currency.id}
                                    className="bg-blue-secondary rounded-xl w-full text-neutral-bg p-4 space-y-6"
                                >
                                    {/* ===== Summary ===== */}
                                    <section>
                                        <h3 className="text-sm font-semibold opacity-80 mb-3">
                                            Summary ({report.currency.name})
                                        </h3>

                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="opacity-70">Cash In</p>
                                                <p className="text-green-400 font-medium">
                                                    {report.currency.name}{" "}{formatAmount(report.summary.cash_in)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="opacity-70">Cash Out</p>
                                                <p className="text-red-400 font-medium">
                                                    {report.currency.name}{" "}{formatAmount(report.summary.cash_out)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="opacity-70">Net Flow</p>
                                                <p
                                                    className={`font-semibold ${flowColor(
                                                        report.summary.net_flow
                                                    )}`}
                                                >
                                                    {report.currency.name}{" "}{formatAmount(report.summary.net_flow)}
                                                </p>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            ))}
                        </section>

                        {/* ===== Breakdown ===== */}
                        {cashFlow?.map((report) => (
                            <section
                                key={report.currency.id}
                                className="bg-blue-secondary rounded-xl w-1/3 text-neutral-bg p-4 space-y-4"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold opacity-80">
                                        Breakdown ({report.currency.name})
                                    </h3>

                                    <div className="flex rounded-lg bg-white/10 p-1 text-xs">
                                        {(["out", "in"] as const).map((mode) => (
                                            <button
                                                key={mode}
                                                onClick={() => setBreakdownMode(mode)}
                                                className={`px-3 py-1 rounded-md transition ${breakdownMode === mode
                                                    ? "bg-white text-blue-primary"
                                                    : "opacity-70 hover:opacity-100"
                                                    }`}
                                            >
                                                Cash {mode === "out" ? "Out" : "In"}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Breakdown body */}
                                {(() => {
                                    const data =
                                        breakdownMode === "out"
                                            ? report.breakdown.cash_out_per_tag
                                            : report.breakdown.cash_in_per_tag

                                    const entries = Object.entries(data)

                                    if (entries.length === 0) {
                                        return (
                                            <div className="h-24 text-sm font-medium text-center flex items-center justify-center opacity-70">
                                                No cash {breakdownMode} history yet.
                                            </div>
                                        )
                                    }

                                    return (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="h-40 overflow-y-auto w-full flex flex-col gap-2 pr-1">
                                                {entries.map(([tag, amount]) => (
                                                    <div
                                                        key={tag}
                                                        className="flex items-center justify-between text-sm"
                                                    >
                                                        <span className="opacity-80 capitalize">
                                                            {tag}
                                                        </span>

                                                        <span
                                                            className={`font-medium ${breakdownMode === "out"
                                                                ? "text-red-400"
                                                                : "text-green-400"
                                                                }`}
                                                        >
                                                            {report.currency.name}{" "}{formatAmount(amount)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {entries.length > 6 ? (
                                                <p className="h-4 text-xs animate-pulse opacity-70">
                                                    Scroll to load more
                                                </p>
                                            ) : (
                                                <div className="h-4" />
                                            )}
                                        </div>
                                    )
                                })()}
                            </section>
                        ))}
                    </div>

                </div>
            </section>
        </>
    )
}

export default CashFlowPage