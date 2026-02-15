import React, { useState, type FormEvent } from 'react'
import { HandlePost } from '../utils/API'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext';

const CreateParticipantPage = (): React.ReactElement => {
    const navigate = useNavigate();

    const { addToast } = useToast();

    const [name, setName] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [type, setType] = useState<"internal" | "external" | "">("")

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!name) {
            addToast(`createParticipantPage:emptyName:${Date.now()}`, "fill a name before continuing", false, false, 5000)
            return
        }

        if (!type) {
            addToast(`createParticipantPage:emptyName:${Date.now()}`, "select a type before continuing", false, false, 5000)
            return
        }

        const url = import.meta.env.VITE_MAIN_BASE_URL + "/v1/participant"

        const body = JSON.stringify({
            participants: [{
                name: name,
                description: description,
                type: type
            }]
        })

        HandlePost(url, body, true)
            .then(() => {
                addToast(`CreateParticipantPage:successCreateParticipant:${Date.now()}`, "participant created", true, false, 5000)
                navigate("/participant")
            })
            .catch((error) => {
                addToast(`CreateParticipantPage:failCreateParticipant:${Date.now()}`, error.message, false, false, 5000)
            })
    }

    return (
        <>
            <section className="h-[calc(100vh-116px)] w-full bg-neutral-primary">
                <div
                    className='py-4 px-8 flex flex-col gap-4'
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-semibold text-neutral-dark">
                            Create Participant
                        </h2>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
                    >
                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-neutral-700">
                                Name
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Participant name"
                                required
                                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm
                                focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                            />
                        </div>

                        {/* Type */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-neutral-700">
                                Type
                            </label>
                            <select
                                value={String(type)}
                                onChange={(e) =>
                                    setType(e.target.value as 'internal' | 'external')
                                }
                                required
                                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm
                                focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                            >
                                <option disabled value="">
                                    Select a type
                                </option>
                                <option value="internal">Internal</option>
                                <option value="external">External</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-neutral-700">
                                Description
                                <span className="ml-1 text-xs text-neutral-400">(optional)</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Short description or notes"
                                rows={3}
                                className="w-full resize-none rounded-lg border border-neutral-300 px-3 py-2 text-sm
                                focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                className="inline-flex items-center rounded-lg bg-neutral-900 px-4 py-2
                                    text-sm font-medium text-white
                                    hover:bg-neutral-800 active:bg-neutral-950
                                    focus:outline-none focus:ring-2 focus:ring-neutral-300"
                            >
                                Submit
                            </button>
                        </div>
                    </form>

                </div>
            </section>
        </>
    )
}

export default CreateParticipantPage