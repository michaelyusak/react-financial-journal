import React from 'react'
import { MdOutlineCategory } from 'react-icons/md'
import { NavLink } from 'react-router-dom'

const AdminSideNav = (): React.ReactElement => {
    return (
        <aside
            className="
                relative w-64 h-[calc(100vh-64px)] bg-blue-muted text-neutral-light 
                flex justify-start items-center py-6 shadow-[0px_0px_40px_10px_rgba(0,0,0,0.7)]
                rounded-r-2xl
            "
        >
            <nav
                className='text-[18px] font-600 w-full flex flex-col gap-1.5'
            >
                <NavLink
                    to="/admin/transaction-category"
                    end
                    className={({ isActive }) =>
                        `
                    ${isActive && "bg-blue-primary"} w-full py-2 px-4 
                    hover:cursor-pointer flex justify-start gap-3 items-center 
                    hover:bg-blue-primary hover:shadow-[0px_0px_60px_1px_rgba(0,0,0,0.7)]
                    `
                    }
                >
                    <MdOutlineCategory></MdOutlineCategory>
                    Transaction Category
                </NavLink>
            </nav>
        </aside>
    )
}

export default AdminSideNav