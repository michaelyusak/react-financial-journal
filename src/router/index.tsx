import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import AuthenticationTemplate from "../templates/AuthTemplate";
import ProtectedRoute from "./ProtectedRoute";
import { RoleAdmin, RoleUser } from "../constants/Role";
import UserTemplate from "../templates/UserTemplate";
import BalancePage from "../pages/BalancePage";
import AccountsPage from "../pages/AccountsPage";
import LedgersPage from "../pages/LedgersPage";
import FinancialAccountDetailPage from "../pages/FinancialAccountDetailPage";
import NewFinancialAccountPage from "../pages/NewFinancialAccountPage";
import AdminPortal from "../pages/AdminPortal";
import LogoutPage from "../pages/LogoutPage";
import AdminTemplate from "../templates/AdminTemplate";
import TransactionCategoryPage from "../pages/TransactionCategoryPage";
import CreateTransactionCategoryPage from "../pages/CreateTransactionCategoryPage";
import StageLedgersPage from "../pages/StageLedgersPage";
import ParticipantPage from "../pages/ParticipantPage";
import CreateParticipantPage from "../pages/CreateParticipantPage";
import CashFlowPage from "../pages/CashFlowPage";
import TransactionPage from "../pages/TransactionPage";
import TransactionDetailPage from "../pages/TransactionDetailPage";
import ParticipantDetailPage from "../pages/ParticipantDetailPage";

const router = createBrowserRouter(
    [
        {
            path: "/login",
            element: <AuthenticationTemplate></AuthenticationTemplate>,
            children: [
                {
                    path: "/login",
                    element: <LoginPage></LoginPage>
                }
            ]
        },
        {
            path: "/logout",
            element: <LogoutPage></LogoutPage>
        },
        {
            path: "/",
            element: <ProtectedRoute acceptedRoles={[RoleUser]}></ProtectedRoute>,
            children: [
                {
                    path: "/",
                    element: <UserTemplate></UserTemplate>,
                    children: [
                        {
                            path: "/",
                            element: <BalancePage></BalancePage>
                        },
                        {
                            path: "/accounts",
                            element: <AccountsPage></AccountsPage>
                        },
                        {
                            path: "/ledgers",
                            element: <LedgersPage></LedgersPage>
                        },
                        {
                            path: "/ledgers/stage",
                            element: <StageLedgersPage></StageLedgersPage>
                        },
                        {
                            path: "/accounts/:financial_account_id",
                            element: <FinancialAccountDetailPage></FinancialAccountDetailPage>
                        },
                        {
                            path: "/accounts/new",
                            element: <NewFinancialAccountPage></NewFinancialAccountPage>
                        },
                        {
                            path: "/transaction-category",
                            element: <TransactionCategoryPage></TransactionCategoryPage>
                        },
                        {
                            path: "/transaction-category/create",
                            element: <CreateTransactionCategoryPage></CreateTransactionCategoryPage>
                        },
                        {
                            path: "/participant",
                            element: <ParticipantPage></ParticipantPage>
                        },
                        {
                            path: "/participant/create",
                            element: <CreateParticipantPage></CreateParticipantPage>
                        },
                        {
                            path: "/cash-flow",
                            element: <CashFlowPage></CashFlowPage>
                        },
                        {
                            path: "/transactions",
                            element: <TransactionPage></TransactionPage>
                        },
                        {
                            path: "/transactions/:transaction_id",
                            element: <TransactionDetailPage></TransactionDetailPage>
                        },
                        {
                            path: "/participant/:participant_id",
                            element: <ParticipantDetailPage></ParticipantDetailPage>
                        }
                    ]
                }
            ]
        },
        {
            path: "/admin",
            element: <ProtectedRoute acceptedRoles={[RoleAdmin]}></ProtectedRoute>,
            children: [
                {
                    path: "/admin",
                    element: <AdminTemplate></AdminTemplate>,
                    children: [
                        {
                            path: "/admin/portal",
                            element: <AdminPortal></AdminPortal>
                        },
                        {
                            path: "/admin/transaction-category",
                            element: <TransactionCategoryPage></TransactionCategoryPage>
                        },
                        {
                            path: "/admin/transaction-category/create",
                            element: <CreateTransactionCategoryPage></CreateTransactionCategoryPage>
                        }
                    ]
                }
            ]
        }
    ],
    { basename: "/" }
)

export default router