import React from 'react'
import { useNavigate } from 'react-router-dom'

const Header = (): React.ReactElement => {
    const navigate = useNavigate();

    return (
        <>
            <header
                className="relative z-10 p-6 flex justify-between items-center shadow-[0px_0px_40px_10px_rgba(0,0,0,0.7)] bg-blue-primary"
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
                    <a
                        href="/logout"
                        className="hover:bg-accent-teal px-1 py-px rounded-sm"
                    >
                        Logout
                    </a>
                </nav>
            </header>
        </>
    )
}

export default Header