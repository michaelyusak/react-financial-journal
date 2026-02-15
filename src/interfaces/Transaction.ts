import type { IParticipant } from "./Participant";
import type { ITransactionCategory } from "./TransactionCategory";

export interface ITransaction {
    id: number;
    accountId: number;
    participant_from: IParticipant;
    participant_to?: IParticipant | null;
    transaction_category: ITransactionCategory;
    occurred_at: number;
    note: string;
    created_at: number;
    updated_at: number;
    deleted_at: number | null;
}
