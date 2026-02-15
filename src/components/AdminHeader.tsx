import React from 'react'
import { NavLink, useLocation } from 'react-router-dom';

const AdminHeader = (): React.ReactElement => {
    const { pathname } = useLocation();

    const isOnPortal = pathname === "/admin/portal";

    return (
        <>
            <header
                className="relative z-10 p-4 flex justify-between items-center shadow-[0px_0px_40px_10px_rgba(0,0,0,0.7)] bg-blue-primary"
            >
                <NavLink
                    to={"/admin"}
                    className='flex h-full items-end gap-2 cursor-pointer'
                >
                    <h1
                        className="text-2xl font-bold text-neutral-light"
                    >
                        Financial Journal
                    </h1>

                    <h2 className='h-fit text-neutral-light'>
                        Admin
                    </h2>
                </NavLink>

                <nav
                    className="space-x-4 text-neutral-light"
                >
                    <NavLink
                        to={isOnPortal ? "/logout" : "/admin/portal"}
                        className="hover:bg-neutral-light hover:text-blue-secondary px-2 py-1 rounded-sm"
                    >
                        {isOnPortal ? "Logout" : "Portal"}
                    </NavLink>
                </nav>
            </header>
        </>
    )
}

export default AdminHeader