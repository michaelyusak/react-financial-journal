import React from 'react'
import { FaListUl } from 'react-icons/fa'
import { FiBookOpen, FiDollarSign } from 'react-icons/fi'
import { IoWalletOutline } from 'react-icons/io5'
import { MdOutlineCategory, MdOutlineCompareArrows } from 'react-icons/md'
import { PiUsersThree } from 'react-icons/pi'
import { NavLink } from 'react-router-dom'

const SideNav = (): React.ReactElement => {
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
                    to="/"
                    end
                    className={({ isActive }) =>
                        `
                    ${isActive && "bg-blue-primary"} w-full py-2 px-4 
                    hover:cursor-pointer flex justify-start gap-3 items-center 
                    hover:bg-blue-primary hover:shadow-[0px_0px_60px_1px_rgba(0,0,0,0.7)]
                    `
                    }
                >
                    <FiDollarSign></FiDollarSign>
                    Balance
                </NavLink>

                <NavLink
                    to="/cash-flow"
                    end
                    className={({ isActive }) =>
                        `
                    ${isActive && "bg-blue-primary"} w-full py-2 px-4 
                    hover:cursor-pointer flex justify-start gap-3 items-center 
                    hover:bg-blue-primary hover:shadow-[0px_0px_60px_1px_rgba(0,0,0,0.7)]
                    `
                    }
                >
                    <MdOutlineCompareArrows></MdOutlineCompareArrows>
                    Cash Flow
                </NavLink>

                <NavLink
                    to="/accounts"
                    className={({ isActive }) =>
                        `
                    ${isActive && "bg-blue-primary"} w-full py-2 px-4 
                    hover:cursor-pointer flex justify-start gap-3 items-center 
                    hover:bg-blue-primary hover:shadow-[0px_0px_60px_1px_rgba(0,0,0,0.7)]
                    `
                    }
                >
                    <IoWalletOutline></IoWalletOutline>
                    Accounts
                </NavLink>

                <NavLink
                    to="/ledgers"
                    className={({ isActive }) =>
                        `
                    ${isActive && "bg-blue-primary"} w-full py-2 px-4 
                    hover:cursor-pointer flex justify-start gap-3 items-center 
                    hover:bg-blue-primary hover:shadow-[0px_0px_60px_1px_rgba(0,0,0,0.7)]
                    `
                    }
                >
                    <FiBookOpen></FiBookOpen>
                    Ledgers
                </NavLink>

                <NavLink
                    to="/transactions"
                    className={({ isActive }) =>
                        `
                    ${isActive && "bg-blue-primary"} w-full py-2 px-4 
                    hover:cursor-pointer flex justify-start gap-3 items-center 
                    hover:bg-blue-primary hover:shadow-[0px_0px_60px_1px_rgba(0,0,0,0.7)]
                    `
                    }
                >
                    <FaListUl></FaListUl>
                    Transactions
                </NavLink>

                <NavLink
                    to="/participant"
                    end
                    className={({ isActive }) =>
                        `
                    ${isActive && "bg-blue-primary"} w-full py-2 px-4 
                    hover:cursor-pointer flex justify-start gap-3 items-center 
                    hover:bg-blue-primary hover:shadow-[0px_0px_60px_1px_rgba(0,0,0,0.7)]
                    `
                    }
                >
                    <PiUsersThree></PiUsersThree>
                    Participant
                </NavLink>

                <NavLink
                    to="/transaction-category"
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

export default SideNav