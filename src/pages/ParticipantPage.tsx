import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import type { IParticipant } from '../interfaces/Participant'
import { HandleGet, HandlePost } from '../utils/API'
import { useToast } from '../contexts/ToastContext'
import type { IFinancialAccount, IFinancialAccountRes } from '../interfaces/FinancialAccount'

const ParticipantPage = (): React.ReactElement => {
    const navigate = useNavigate();

    const { addToast } = useToast();
    const [searchParams, setSearchParams] = useSearchParams();

    const [participants, setParticipants] = useState<IParticipant[] | null>(null)
    const [isCreateFromFinancialAccount, setIsCreateFromFinancialAccount] = useState<boolean>(false);
    const [selectedFinancialAccountIdForCreate, setSelectedFinancialAccountIdForCreate] = useState<number | null>(null)
    const [financialAccountList, setFinancialAccountList] = useState<IFinancialAccountRes[] | null>(null)

    const participantType = searchParams.get("type");

    function getFinancialAccount(id: number): IFinancialAccount | null {
        if (!financialAccountList) {
            return null
        }

        let found: IFinancialAccount | null = null

        financialAccountList.forEach((acc) => {
            if (acc.id == id) {
                found = acc
            }
        })

        return found
    }

    const onTypeChange = (value: string) => {
        const params = new URLSearchParams(searchParams);

        if (value == "external" || value == "internal") {
            params.set("type", value);
        } else {
            params.delete("type");
        }

        setSearchParams(params);
    };

    function getParticipants() {
        const url = import.meta.env.VITE_MAIN_BASE_URL + `/v1/participant${participantType ? `?type=${participantType}` : ""}`

        HandleGet<IParticipant[]>(url, true)
            .then((data) => {
                setParticipants(data)
            })
            .catch((error) => {
                addToast(`participantPage:failGetParticipants:${Date.now()}`, error.message, false, false, 5000)
            })
    }

    const getFinancialAccountList = () => {
        const url = import.meta.env.VITE_MAIN_BASE_URL + "/v1/financial-account"

        HandleGet<IFinancialAccountRes[]>(url, true)
            .then((data) => {
                setFinancialAccountList(data)
            })
            .catch((error) => {
                addToast(`participantPage:failGetFinancialAccountList:${Date.now()}`, error.message, false, false, 5000)
            })
    }

    function createParticipantFromFinancialAccountId() {
        if (selectedFinancialAccountIdForCreate == null) {
            addToast(`participantPage:emptyFinancialAccountIdForCreate:${Date.now()}`, "Please select an account before continuing", false, false, 5000)
            return
        }

        const url = import.meta.env.VITE_MAIN_BASE_URL + `/v1/financial-account/${selectedFinancialAccountIdForCreate}/participant`

        HandlePost(url, null, true)
            .then(() => {
                setSelectedFinancialAccountIdForCreate(null)
                setIsCreateFromFinancialAccount(false)
                getParticipants()
            })
            .catch((error) => {
                addToast(`participantPage:failCreateParticipantFromFinancialAccountId:${Date.now()}`, error.message, false, false, 5000)
            })
    }

    useEffect(() => {
        getParticipants()
    }, [participantType])

    useEffect(() => {
        if (financialAccountList) {
            return
        }

        getFinancialAccountList()
    }, [])

    return (
        <>
            <section className="h-[calc(100vh-116px)] w-full bg-neutral-primary">
                <div
                    className='py-4 px-8 flex flex-col gap-4'
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-semibold text-neutral-dark">
                            Participants
                        </h2>

                        <div
                            className='flex-1 flex justify-end gap-5'
                        >
                            <select
                                value={participantType ?? ""}
                                onChange={(e) => onTypeChange(e.target.value)}
                                className="px-4 py-2 rounded-md
                                bg-blue-secondary text-white text-sm font-medium
                                hover:bg-blue-primary hover:shadow-2xl transition"
                            >
                                <option value={""}>All Types</option>
                                <option value={"external"}>External</option>
                                <option value={"internal"}>Internal</option>
                            </select>

                            <button
                                onClick={() => setIsCreateFromFinancialAccount(true)}
                                className="px-4 py-2 rounded-md
                                bg-blue-secondary text-white text-sm font-medium
                                hover:bg-blue-primary hover:shadow-2xl transition"
                            >
                                + Create Participant from Account
                            </button>

                            <NavLink
                                to={"/participant/create"}
                                className="px-4 py-2 rounded-md
                                bg-blue-secondary text-white text-sm font-medium
                                hover:bg-blue-primary hover:shadow-2xl transition"
                            >
                                + Create Participant
                            </NavLink>
                        </div>
                    </div>

                    {/* List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 h-170 overflow-y-auto">
                        {participants && participants.map((participant) => (
                            <div
                                onClick={() => navigate(`/participant/${participant.id}`)}
                                key={participant.id}
                                className="rounded-lg border border-neutral-200
                                    bg-white p-4 cursor-pointer
                                    hover:shadow-md transition"
                            >
                                {/* Title */}
                                <div
                                    className='flex w-full justify-between items-center'
                                >
                                    <div className="text-lg font-semibold text-neutral-800">
                                        {participant.name}
                                    </div>

                                    <div
                                        className={`px-2 py-1 rounded-md 
                                            ${participant.type == "external" && "bg-amber-400"}
                                            ${participant.type == "internal" && "bg-green-400"}
                                            font-semibold text-blue-primary`}
                                    >
                                        {participant.type}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mt-1 text-sm text-neutral-600">
                                    {participant.description || "No description"}
                                </div>

                                <div className="flex text-neutral-600 text-[12px] justify-start mt-1.5 gap-2">
                                    {participant.type == 'internal' && (
                                        <>
                                            <p className=''>
                                                Linked to:
                                            </p>

                                            {(() => {
                                                if (!participant.financial_account) return (<p>-</p>)

                                                const acc = getFinancialAccount(participant.financial_account.id)
                                                if (!acc) return (<p>-</p>)

                                                return (
                                                    <p>
                                                        Account {acc.bank.name} – {acc.name} ({acc.number})
                                                    </p>
                                                )
                                            })()}
                                        </>
                                    )}


                                </div>

                                {/* Meta */}
                                <div className="mt-4 flex justify-between text-xs text-neutral-400">
                                    <span>Created: {participant.created_at}</span>
                                    <span>Updated: {participant.updated_at}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {isCreateFromFinancialAccount && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setIsCreateFromFinancialAccount(false)}
                        />

                        {/* Modal */}
                        <div className="
                          relative z-10 w-full max-w-md
                          bg-white rounded-lg shadow-lg
                          p-6 flex flex-col gap-4
                        ">
                            <h3 className="text-lg font-semibold text-neutral-900">
                                Create Participant
                            </h3>

                            <p className="text-sm text-neutral-500">
                                Select a financial account. This will generate a
                                participant based on the selected account.
                            </p>

                            {/* Account selector */}
                            <select
                                className="
                                  w-full px-3 py-2 border rounded-md
                                  text-sm focus:outline-none
                                  focus:ring-2 focus:ring-red-500
                                "
                                value={selectedFinancialAccountIdForCreate ?? ""}
                                onChange={(e) => setSelectedFinancialAccountIdForCreate(Number(e.target.value))}
                            >
                                <option value="" disabled>
                                    Select an account
                                </option>
                                {financialAccountList && financialAccountList.map((acc) => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.bank.name} — {acc.name} ({acc.number})
                                    </option>
                                ))}
                            </select>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={() => setIsCreateFromFinancialAccount(false)}
                                    className="
                                      px-4 py-2 text-sm rounded-md
                                      border border-neutral-300
                                      hover:bg-neutral-100
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    disabled={!selectedFinancialAccountIdForCreate}
                                    onClick={() => createParticipantFromFinancialAccountId()}
                                    className="
                                      px-4 py-2 text-sm rounded-md
                                      bg-success text-white
                                      hover:bg-green-700
                                      disabled:opacity-50
                                      disabled:cursor-not-allowed
                                    "
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    )
}

export default ParticipantPage