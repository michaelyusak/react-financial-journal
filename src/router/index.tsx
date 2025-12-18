import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import AuthenticationTemplate from "../templates/AuthTemplate";
import ProtectedRoute from "./ProtectedRoute";
import { RoleUser } from "../constants/Role";
import UserTemplate from "../templates/UserTemplate";

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
                            element: <Dashboard></Dashboard>
                        }
                    ]
                }
            ]
        }
    ],
    { basename: "/" }
)

export default router