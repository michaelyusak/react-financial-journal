import React, { useState } from "react";

import { useToast } from "../contexts/ToastContext";
import { useNavigate } from "react-router-dom";
import Form from "../components/Form";
import { Login } from "../utils/API";
import type { IInputField } from "../interfaces/InputField";

const LoginPage = (): React.ReactElement => {
    const navigate = useNavigate();
    const loginInputFields: IInputField[] = [
        {
            name: "email",
            type: "email",
            placeholder: "Email",
            isRequired: true,
            isForLogin: true,
        },
        {
            name: "password",
            type: "password",
            placeholder: "Password",
            isRequired: true,
            isForLogin: true,
        },
    ];

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { addToast, removeToast } = useToast()

    function handleLogin(inputValues: {
        [key: string]: { value: string; error: string };
    }) {
        const loginLoadingToastKey = `loginPage:loginLoading:${Date.now()}`

        addToast(loginLoadingToastKey, "Signing you in", undefined, false)
        setIsLoading(true);

        const email = inputValues["email"].value;
        const password = inputValues["password"].value;

        Login(email, password)
            .then(() => {
                removeToast(loginLoadingToastKey)
                navigate("/")
            })
            .catch((error: Error) => {
                removeToast(loginLoadingToastKey)
                addToast(`loginPage:failedToLogin:${Date.now()}`, error.message, false, false, 5000)
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    return (
        <div
            className="relative w-[80%] lg:w-[30%] h-[70%] bg-neutral-light m-auto lg:m-0 shadow-[0px_0px_40px_5px_rgba(0,0,0,0.7)] rounded-[20px] lg:rounded-l-[30px] p-12.5 flex flex-col justify-center gap-6.25"
        >
            <h1
                className="text-[30px] font-semibold text-blue-primary"
            >
                Login to account
            </h1>

            <Form
                inputFields={loginInputFields}
                submitButtonText="Login"
                onSubmit={(inputValues) => handleLogin(inputValues)}
            ></Form>

            <div
                className={`${isLoading ? "" : "hidden"
                    } absolute z-10 w-full h-full top-0 left-0 right-0 rounded-[20px] lg:rounded-l-[30px] bottom-0 bg-[rgba(128,128,128,0.4)]`}
            />
        </div>
    );
};

export default LoginPage;
