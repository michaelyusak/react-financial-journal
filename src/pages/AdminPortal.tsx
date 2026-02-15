import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminPortal = (): React.ReactElement => {
    return (
        <div
            className="w-full h-[calc(100vh-64px)] 
                    flex justify-center items-center 
                    gap-12
                    text-neutral-light"
        >
            <NavLink
                to="/"
                className="group w-72 h-44 rounded-xl border border-neutral-bg
               flex flex-col justify-center items-center
               bg-blue-secondary hover:bg-blue-primary
               hover:border-blue-light hover:shadow-lg
               transition-all duration-300"
            >
                <span className="text-2xl font-semibold">
                    User
                </span>
                <span className="mt-2 text-sm">
                    Personal dashboard
                </span>
            </NavLink>

            <NavLink
                to="/admin"
                className="group w-72 h-44 rounded-xl border border-neutral-bg
               flex flex-col justify-center items-center
               bg-blue-secondary hover:bg-blue-primary
               hover:border-blue-light hover:shadow-lg
               transition-all duration-300"
            >
                <span className="text-2xl font-semibold">
                    Admin
                </span>
                <span className="mt-2 text-sm">
                    Manage system & data
                </span>
            </NavLink>
        </div>
    )
}

export default AdminPortal