import React from 'react'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'

const UserTemplate = (): React.ReactElement => {
    return (
        <>
            <section
                className='min-h-screen'
            >
                <Header></Header>

                <main className="flex-1">
                    <Outlet />
                </main>
            </section>
        </>
    )
}

export default UserTemplate