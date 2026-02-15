import React from 'react'
import AdminHeader from '../components/AdminHeader'
import Breadcrumbs from '../components/Breadcrumbs'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSideNav from '../components/AdminSideNav'

const AdminTemplate = (): React.ReactElement => {
    const { pathname } = useLocation();

    const isOnPortal = pathname === "/admin/portal";

    return (
        <section
            className='min-h-screen bg-neutral-primary'
        >
            <AdminHeader></AdminHeader>

            {/* Body */}
            <div className="flex flex-1">
                {/* Side navigation */}
                {!isOnPortal && <AdminSideNav />}

                <div className='flex-1'>
                    {!isOnPortal && <Breadcrumbs />}

                    {/* Main content */}
                    <main className="flex flex-1">
                        <Outlet />
                    </main>
                </div>
            </div>
        </section>
    )
}

export default AdminTemplate