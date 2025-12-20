import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const Header = (): React.ReactElement => {
    const navigate = useNavigate();

    return (
        <>
            <header
                className="relative z-10 p-4 flex justify-between items-center shadow-[0px_0px_40px_10px_rgba(0,0,0,0.7)] bg-blue-primary"
            >
                <h1
                    className="text-2xl font-bold text-neutral-light cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    Financial Journal
                </h1>

                <nav
                    className="space-x-4 text-neutral-light"
                >
                    <NavLink
                        to="/logout"
                        className="hover:bg-neutral-light hover:text-blue-secondary px-2 py-1 rounded-sm"
                    >
                        Logout
                    </NavLink>
                </nav>
            </header>
        </>
    )
}

export default Header