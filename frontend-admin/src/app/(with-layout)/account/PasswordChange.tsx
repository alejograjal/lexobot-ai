"use client"

import { useState } from "react";
import PasswordChangeForm from "./components/PasswordChangeForm";
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks";
import { PasswordChangeValues } from "./components/PasswordChangeSchema";
import { UsePostAccountChangePassword } from "@/hooks/api/lexobot-ai/account/UsePostAccountChangePassword";

export default function PasswordChange() {
    const [loading, setLoading] = useState(false);

    const closeLoading = () => setLoading(false);

    const { mutate: postChangePassword } = UsePostAccountChangePassword(UseMutationCallbacks('Contraseña cambiada con éxito', '/dashboard', closeLoading));

    const handleSubmit = async (data: PasswordChangeValues) => {
        setLoading(true)
        await postChangePassword(data)
    }

    return (
        <>
            <div className="flex items-center my-8 max-w-md">
                <div className="flex-grow border-t border-gray-300" />
                <span className="mx-4 text-gray-500 text-sm">Cambio de contraseña</span>
                <div className="flex-grow border-t border-gray-300" />
            </div>

            <PasswordChangeForm onloading={loading} onSubmit={handleSubmit} />
        </>
    )
}