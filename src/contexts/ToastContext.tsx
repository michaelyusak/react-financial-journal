// contexts/ToastContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import Toast from "../components/Toast";

export interface ToastData {
    id: string;
    message: string;
    isSuccess?: boolean;
    withLoginRedirection?: boolean;
}

interface ToastContextValue {
    toasts: ToastData[];
    addToast: (
        id: string,
        message: string,
        isSuccess?: boolean,
        withLoginRedirection?: boolean,
        durationMs?: number
    ) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastData[]>([]);
    const [isContainPending, setIsContainPending] = useState<boolean>(false);

    function removeToast(id: string) {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }

    function addToast(
        id: string,
        message: string,
        isSuccess?: boolean,
        withLoginRedirection?: boolean,
        durationMs?: number
    ) {
        if (toasts.length >= 5) return;

        setToasts((prev) => {
            if (prev.some((t) => t.id === id)) return prev;

            return [
                ...prev,
                { id, message, isSuccess, withLoginRedirection },
            ]
        });

        if (durationMs) {
            setTimeout(() => removeToast(id), durationMs);
        }
    }

    useEffect(() => {
        let containPending = false

        toasts.forEach((toast) => {
            if (toast.isSuccess === undefined) {
                containPending = true
            }
        })

        setIsContainPending(containPending)
    }, [toasts])

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {isContainPending && (
                <div
                    className="absolute inset-0 bg-black/40"
                />
            )}

            {children}
            {/* Toast Container */}
            {toasts.length > 0 && (
                <div className="w-[80%] md:w-[70%] xl:w-[60%] fixed top-12.5 left-1/2 -translate-x-1/2 flex flex-col gap-3 z-1000">
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            message={toast.message}
                            isSuccess={toast.isSuccess}
                            withLoginButton={toast.withLoginRedirection}
                            onClose={() => removeToast(toast.id)}
                        ></Toast>
                    ))}
                </div>
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return ctx;
}