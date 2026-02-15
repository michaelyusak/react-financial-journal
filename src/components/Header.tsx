import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { RoleAdmin } from '../constants/Role';
import { ValidateAccount } from '../utils/API';

const Header = (): React.ReactElement => {
    const [isAdmin, setIsAdmin] = useState<boolean>()

    useEffect(() => {
        if (isAdmin != undefined) {
            return
        }

        ValidateAccount()
            .then((data) => {
                setIsAdmin(data.roles.includes(RoleAdmin));
            })
            .catch(() => {
                setIsAdmin(false);
            });
    }, [])

    return (
        <>
            <header
                className="relative z-10 p-4 flex justify-between items-center shadow-[0px_0px_40px_10px_rgba(0,0,0,0.7)] bg-blue-primary"
            >
                <NavLink
                    to={"/"}
                >
                    <h1
                        className="text-2xl font-bold text-neutral-light cursor-pointer"
                    >
                        Financial Journal
                    </h1>
                </NavLink>

                <nav
                    className="space-x-4 text-neutral-light"
                >
                    <NavLink
                        to={isAdmin ? "/admin/portal" : "/logout"}
                        className="hover:bg-neutral-light hover:text-blue-secondary px-2 py-1 rounded-sm"
                    >
                        {isAdmin ? "Portal" : "Logout"}
                    </NavLink>
                </nav>
            </header>
        </>
    )
}

export default Header