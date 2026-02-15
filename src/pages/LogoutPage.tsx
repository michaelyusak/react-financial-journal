import React from 'react'
import { Navigate } from 'react-router-dom'
import { RemoveAuthCookies } from '../utils/API'

const LogoutPage = (): React.ReactElement => {
    RemoveAuthCookies()

    return (
        <>
            <Navigate
                to={"/login"}
            ></Navigate>
        </>
    )
}

export default LogoutPage