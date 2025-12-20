import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import AuthenticationTemplate from "../templates/AuthTemplate";
import ProtectedRoute from "./ProtectedRoute";
import { RoleUser } from "../constants/Role";
import UserTemplate from "../templates/UserTemplate";
import BalancePage from "../pages/BalancePage";
import AccountsPage from "../pages/AccountsPage";
import LedgersPage from "../pages/LedgersPage";
import FinancialAccountDetailPage from "../pages/FinancialAccountDetailPage";

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
                            path: "/accounts/:financial_account_id",
                            element: <FinancialAccountDetailPage></FinancialAccountDetailPage>
                        },
                        }
                    ]
                }
            ]
        }
    ],
    { basename: "/" }
)

export default router