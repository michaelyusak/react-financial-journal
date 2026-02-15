import React, { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { IoMdClose } from 'react-icons/io'
import { useToast } from '../contexts/ToastContext';
import { HandleDelete, HandleGet, HandlePost } from '../utils/API';
import type { IFinancialAccountRes } from '../interfaces/FinancialAccount';
import type { IStagingLedger } from '../interfaces/StagingLedger';
import { useNavigate } from 'react-router-dom';

const StageLedgersPage = (): React.ReactElement => {
  const navigate = useNavigate();

  const inputFile = useRef<HTMLInputElement>(null);

  const { addToast, removeToast } = useToast();

  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
  }>({ name: "", size: 0 });
  const [isError, setIsError] = useState<boolean>(false)
  const [financialAccountList, setFinancialAccountList] = useState<IFinancialAccountRes[]>()
  const [selectedFinancialAccountId, setSelectedFinancialAccountId] = useState<number | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stagedLedgers, setStagedLedgers] = useState<IStagingLedger[] | null>(null)
  const [isDeleteByAccountOpen, setIsDeleteByAccountOpen] = useState<boolean>(false)
  const [selectedFinancialAccountIdForDelete, setSelectedFinancialAccountIdForDelete] = useState<number | null>(null)

  const getFinancialAccountList = () => {
    const url = import.meta.env.VITE_MAIN_BASE_URL + "/v1/financial-account"

    HandleGet<IFinancialAccountRes[]>(url, true)
      .then((data) => {
        setFinancialAccountList(data)
      })
      .catch((error) => {
        addToast(`stageLedgersPage:failGetFinancialAccountList:${Date.now()}`, error.message, false, false, 5000)
      })
  }

  function handleSetFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files !== null) {
      const file = e.target.files[0];
      setFileInfo({ name: file.name, size: file.size });
      setSelectedFile(file)
    }
  }

  function handleRemoveFile() {
    if (inputFile.current) {
      inputFile.current;
      inputFile.current.value = "";
      inputFile.current.type = "text";
      inputFile.current.type = "file";
    }

    setFileInfo({ name: "", size: 0 });
    setSelectedFile(null)
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }

    const file = e.target.files[0];

    const fileName = file.name;
    const fileSize = file.size;

    let errorMsg = "";

    const fileFormat = fileName.split(".").pop();

    if (
      fileFormat !== "csv"
    ) {
      errorMsg = `File must be in csv format`;
      addToast(`stageLedgersPage:invalidFileFormat:${Date.now()}`, errorMsg, false, false, 5000)
      return;
    }

    if (fileSize > 100000) {
      errorMsg = `File must not be greater than 1MB`;
      addToast(`stageLedgersPage:invalidFileSize:${Date.now()}`, errorMsg, false, false, 5000)
      return;
    }

    setIsError(errorMsg.length > 0)
    handleSetFile(e);
  }

  function handleSubmitStagingLedgers() {
    if (selectedFinancialAccountId == null || selectedFinancialAccountId == 0) {
      addToast(`stageLedgersPage:emptyFinancialAccountId:${Date.now()}`, "Please select an account before continuing", false, false, 5000)
      return
    }

    if (!selectedFile) {
      addToast(`stageLedgersPage:emptyFile:${Date.now()}`, "Please upload a csv before continuing", false, false, 5000)
      return
    }

    const url = import.meta.env.VITE_MAIN_BASE_URL + `/v1/financial-account/${selectedFinancialAccountId}/staging-ledger/import`

    const formData = new FormData();
    formData.append("file", selectedFile)

    HandlePost(url, formData, true)
      .then(() => {
        handleRemoveFile();
        setSelectedFinancialAccountId(null)

        getStagingLedgers();
      })
      .catch((error) => {
        addToast(`stageLedgersPage:failSubmitStagingLedgers:${Date.now()}`, error.message, false, false, 5000)
      })
  }

  function getStagingLedgers() {
    const url = import.meta.env.VITE_MAIN_BASE_URL + "/v1/staging-ledger"

    HandleGet<IStagingLedger[]>(url, true)
      .then((data) => {
        setStagedLedgers(data)
      })
  }

  function deleteLedgersByFinancialAccount() {
    if (selectedFinancialAccountIdForDelete == null) {
      addToast(`stageLedgersPage:emptyFinancialAccountIdForDelte:${Date.now()}`, "Please select an account before continuing", false, false, 5000)
      return
    }

    const url = import.meta.env.VITE_MAIN_BASE_URL + `/v1/financial-account/${selectedFinancialAccountIdForDelete}/staging-ledger`

    HandleDelete(url, null, true)
      .then(() => {
        setSelectedFinancialAccountIdForDelete(null)
        getStagingLedgers()
        setIsDeleteByAccountOpen(false)
        addToast(`stageLedgersPage:successDeleteLedgersByFinancialAccount:${Date.now()}`, "ledgers deleted", true, false, 5000)
      })
      .catch((error) => {
        addToast(`stageLedgersPage:failDeleteLedgersByFinancialAccount:${Date.now()}`, error.message, false, false, 5000)
      })
  }

  function commitStagedLedgers() {
    const commitStagedLedgersLoadingToastId = `stageLedgersPage:loadingCommitStagedLedgers:${Date.now()}`
    addToast(commitStagedLedgersLoadingToastId, 'committing ledgers...', undefined, false)

    const url = import.meta.env.VITE_MAIN_BASE_URL + `/v1/staging-ledger/commit`

    HandlePost(url, null, true)
      .then(() => {
        removeToast(commitStagedLedgersLoadingToastId)

        navigate("/ledgers")
        addToast(`stageLedgersPage:successCommitLedgers:${Date.now()}`, "ledgers committed", true, false, 5000)
      })
      .catch((error) => {
        removeToast(commitStagedLedgersLoadingToastId)

        addToast(`stageLedgersPage:failCommitLedgers:${Date.now()}`, error.message, false, false, 5000)
      })
  }

  useEffect(() => {
    if (financialAccountList) {
      return
    }

    getFinancialAccountList()
  }, [])

  useEffect(() => {
    if (stagedLedgers) {
      return
    }

    getStagingLedgers()
  }, [])

  return (
    <>
      <section className="h-[calc(100vh-116px)] w-full bg-neutral-primary">
        <div className='py-4 px-8 flex flex-col gap-4 w-full h-full'>
          {/* Header */}
          <h2 className="text-3xl font-semibold text-neutral-dark">
            Stage Ledgers
          </h2>

          {/* Upload */}
          {!fileInfo.name ? (
            <>
              <input
                type="file"
                className="hidden"
                id="stageLedgersPage:inputFile"
                ref={inputFile}
                onChange={handleFileChange}
                required
              />

              <label htmlFor="stageLedgersPage:inputFile">
                <div
                  className={`
                      px-5 py-2.5 w-fit rounded-md border text-sm font-medium
                      cursor-pointer
                      bg-blue-secondary text-white
                      hover:bg-blue-primary hover:shadow-sm
                      transition
                      ${isError
                      ? "border-danger text-danger"
                      : "border-neutral-300 text-neutral-700"
                    }
                      `}
                >
                  Upload Ledgers File
                </div>
              </label>
            </>
          ) : (
            <div className="flex gap-6 items-center">
              {/* Account selector */}
              <div className="flex items-center gap-3">
                <label
                  htmlFor="applyAccount"
                  className="text-sm font-semibold text-neutral-600 whitespace-nowrap"
                >
                  Apply to
                </label>

                <select
                  id="applyAccount"
                  className="p-3 text-sm rounded-md
                      border border-neutral-300 bg-white
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      min-w-[320px]"
                  onChange={(e) => setSelectedFinancialAccountId(Number(e.target.value))}
                  required
                >
                  <option value="" disabled selected>
                    Select an account
                  </option>

                  {financialAccountList?.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.bank.name} — {account.name} ({account.number})
                    </option>
                  ))}
                </select>
              </div>

              {/* Uploaded file info */}
              <div
                className="flex items-center gap-4
                  bg-white border border-neutral-200
                    rounded-md px-4 py-0.5
                    hover:shadow-sm transition
                    min-w-90"
              >
                {/* File name */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-800 truncate">
                    {fileInfo.name}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {(fileInfo.size / 1000).toFixed(2)} kB
                  </p>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 rounded-md
                    text-neutral-500
                    hover:text-red-600
                    hover:bg-neutral-100 transition"
                  aria-label="Remove file"
                >
                  <IoMdClose size={16} />
                </button>
              </div>

              <button
                className="px-5 py-2.5 rounded-md
                  bg-blue-secondary text-white text-sm font-medium
                  hover:bg-blue-primary hover:shadow-2xl transition"
                onClick={() => handleSubmitStagingLedgers()}
              >
                Stage
              </button>
            </div>
          )}

          <div className="w-full relative">
            {/* HEADER TABLE */}
            <table className="w-full border-collapse table-fixed">
              <thead>
                <tr className="border-b-4 border-blue-primary">
                  <th className="text-left py-2 px-3">Time</th>
                  <th className="text-left py-2 px-3">Account</th>
                  <th className="text-left py-2 px-3">Amount</th>
                  <th className="text-left py-2 px-3">Note</th>
                  <th className="text-left py-2 px-3">Category</th>
                  <th className="text-left py-2 px-3">Action</th>
                </tr>
              </thead>
            </table>

            {/* SCROLLABLE BODY */}
            <div
              className="h-[calc(100vh-400px)] overflow-y-auto"
            >
              <table className="w-full border-collapse table-fixed">
                <tbody>
                  {stagedLedgers?.map((ledger) => (
                    <tr
                      key={ledger.id}
                      className="border-b border-blue-secondary hover:bg-neutral-bg"
                    >
                      <td className="py-2 px-3 text-sm text-blue-primary">
                        {new Date(ledger.occurred_at * 1000).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-left uppercase">
                        {ledger.financial_account.bank.name} - {ledger.financial_account.name} ({ledger.financial_account.number})
                      </td>
                      <td className="py-2 px-3 text-left uppercase">
                        {ledger.financial_account.currency.name}  {Number(ledger.amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}

                      </td>
                      <td className="py-2 px-3">
                        {ledger.note || "-"}
                      </td>
                      <td className="py-2 px-3 capitalize">
                        {ledger.transaction_category.category ?? "-"}
                      </td>

                      <td>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {stagedLedgers && stagedLedgers.length > 7 && (
              <span
                className='absolute bottom-0 translate-y-full left-1/2 transform -translate-x-1/2
                text-sm text-neutral-dark animate-pulse'
              >
                Scroll to view more
              </span>
            )}
          </div>

          <div
            className='w-full flex justify-end'
          >
            <button
              onClick={() => setIsDeleteByAccountOpen(true)}
              className='px-5 py-2.5 w-fit rounded-md border text-sm font-medium
                      cursor-pointer
                      bg-danger text-white
                      hover:bg-red-700 hover:shadow-sm
                      transition'
            >
              Delete By Financial Account
            </button>

            <button
              onClick={() => commitStagedLedgers()}
              className='px-5 py-2.5 w-fit rounded-md border text-sm font-medium
                      cursor-pointer
                      bg-blue-secondary text-white
                      hover:bg-blue-primary hover:shadow-sm
                      transition'
            >
              Commit
            </button>
          </div>
        </div>

        {isDeleteByAccountOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsDeleteByAccountOpen(false)}
            />

            {/* Modal */}
            <div className="
              relative z-10 w-full max-w-md
              bg-white rounded-lg shadow-lg
              p-6 flex flex-col gap-4
            ">
              <h3 className="text-lg font-semibold text-neutral-900">
                Delete Transactions
              </h3>

              <p className="text-sm text-neutral-500">
                Select a financial account. This will mark all related data
                as deleted without permanently removing it.
              </p>

              {/* Account selector */}
              <select
                className="
                  w-full px-3 py-2 border rounded-md
                  text-sm focus:outline-none
                  focus:ring-2 focus:ring-red-500
                "
                value={selectedFinancialAccountIdForDelete ?? ""}
                onChange={(e) => setSelectedFinancialAccountIdForDelete(Number(e.target.value))}
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
                  onClick={() => setIsDeleteByAccountOpen(false)}
                  className="
                    px-4 py-2 text-sm rounded-md
                    border border-neutral-300
                    hover:bg-neutral-100
                  "
                >
                  Cancel
                </button>

                <button
                  disabled={!selectedFinancialAccountIdForDelete}
                  onClick={() => deleteLedgersByFinancialAccount()}
                  className="
                    px-4 py-2 text-sm rounded-md
                    bg-danger text-white
                    hover:bg-red-700
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

    </>
  )
}

export default StageLedgersPage