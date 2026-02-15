import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { HandleGet, HandlePut } from '../utils/API';
import type { IParticipant } from '../interfaces/Participant';
import { useToast } from '../contexts/ToastContext';
import type { IFinancialAccount } from '../interfaces/FinancialAccount';

const ParticipantDetailPage = (): React.ReactElement => {
    const { participant_id } = useParams<{ participant_id: string }>();
    const navigate = useNavigate();

    const { addToast } = useToast();

    const [participant, setParticipant] = useState<IParticipant | null>(null)
    const [description, setDescription] = useState<string>("")
    const [financialAccounts, setFinancialAccount] = useState<IFinancialAccount[] | null>(null)
    const [linkedFinancialAccountId, setLinkedFinancialAccountId] = useState<number | null>(null)

    function getParticipant() {
        const url = import.meta.env.VITE_MAIN_BASE_URL + `/v1/participant/${participant_id}`

        HandleGet<IParticipant>(url, true)
            .then((data) => {
                setParticipant(data)
                setDescription(data.description)
                setLinkedFinancialAccountId(data.financial_account?.id ?? null)
            })
            .catch((error) => {
                addToast(`participantDetailPage:failGetParticipant:${Date.now()}`, error.message, false, false, 5000)
            })
    }

    function handleSubmit() {
        if (!linkedFinancialAccountId && participant?.type == "internal") {
            addToast(`participantDetailPage:emptyFinancialAccountId:${Date.now()}`, "select type to continue", false, false, 5000)
            return
        }

        const url = import.meta.env.VITE_MAIN_BASE_URL + `/v1/participant/${participant_id}`

        const body = JSON.stringify({
            description: description,
            financial_account_id: linkedFinancialAccountId
        })

        HandlePut(url, body, true)
        .then(() => {
            addToast(`participantDetailPage:emptyFinancialAccountId:${Date.now()}`, "participant updated", true, false, 5000)
            navigate("/participant")
        })
    }

    function getFinancialAccounts() {
        const url = import.meta.env.VITE_MAIN_BASE_URL + "/v1/financial-account"

        HandleGet<IFinancialAccount[]>(url, true)
            .then((data) => {
                setFinancialAccount(data)
            })
            .catch((error) => {
                addToast(`participantDetailPage:failGetFinancialAccounts:${Date.now()}`, error.message, false, false, 5000)
            })
    }

    useEffect(() => {
        if (participant) {
            return
        }

        getParticipant()
    }, [])

    useEffect(() => {
        if (financialAccounts) {
            return
        }

        getFinancialAccounts()
    }, [])

    return (
        <>
            <section className="h-[calc(100vh-116px)] w-full bg-neutral-primary">
                <div
                    className='py-4 px-8 flex flex-col gap-4'
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-semibold text-neutral-dark">
                            Participant Detail
                        </h2>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleSubmit()
                        }}
                        className="flex flex-col gap-4 max-w-md"
                    >
                        {/* Participant name (read-only) */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Participant</label>
                            <input
                                type="text"
                                value={participant?.name ?? "—"}
                                disabled
                                className="px-3 py-2 rounded-md border bg-neutral-100 text-neutral-600 cursor-not-allowed"
                            />
                        </div>

                        {/* Participant type */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Type</label>
                            <select
                                className="px-3 py-2 rounded-md border bg-white disabled:cursor-not-allowed"
                                disabled
                            >
                                <option selected={participant?.type == "external"}>External</option>
                                <option selected={participant?.type == "internal"}>Internal</option>
                            </select>
                        </div>

                        {participant && participant.type == "internal" && (
                            <>
                                {/* Financial Account */}
                                < div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium">Linked Financial Account</label>
                                    <select
                                        value={linkedFinancialAccountId ?? ""}
                                        onChange={(e) => setLinkedFinancialAccountId(+e.target.value)}
                                        className="px-3 py-2 rounded-md border bg-white"
                                    >
                                        <option value="" disabled>
                                            Select type
                                        </option>
                                        {financialAccounts?.map((acc) => (
                                            <option value={acc.id} key={acc.id}>
                                                {acc.bank.name} — {acc.name} ({acc.number})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Description */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                placeholder="Optional notes about this participant"
                                className="px-3 py-2 rounded-md border resize-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => navigate("/participant")}
                                className="px-4 py-2 rounded-md border hover:bg-neutral-100"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="px-4 py-2 rounded-md bg-blue-primary text-white hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </form>

                </div >
            </section >
        </>
    )
}

export default ParticipantDetailPage