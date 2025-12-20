import React from 'react'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'
import SideNav from '../components/SideNav'
import Breadcrumbs from '../components/Breadcrumbs'

const UserTemplate = (): React.ReactElement => {
    return (
        <>
            <section
                className='min-h-screen bg-neutral-primary'
            >
                <Header></Header>

                {/* Body */}
                <div className="flex flex-1">
                    {/* Side navigation */}
                    <SideNav />

                    <div className='flex-1'>
                        <Breadcrumbs />

                        {/* Main content */}
                        <main className="flex flex-1">
                            <Outlet />
                        </main>
                    </div>
                </div>
            </section>
        </>
    )
}

export default UserTemplate