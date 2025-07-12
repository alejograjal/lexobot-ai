"use client"

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserUpdate } from "@/types/lexobot-ai";
import { AccountForm } from "./components/AccountForm";
import { UsePutAccount } from "@/hooks/api/lexobot-ai/account/UsePutAccount";
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks";

export default function AccountInformation() {
    const [loading, setLoading] = useState(false)
    const { userProfile } = useAuth()

    const defaultValuesAccount = useMemo(() => ({
        first_name: userProfile!.first_name,
        last_name: userProfile!.last_name,
        username: userProfile!.username,
        email: userProfile!.email,
        phone_number: userProfile!.phone_number!,
        role_id: userProfile!.role.id
    }), [userProfile])

    const closeLoading = () => setLoading(false)

    const { mutate: updateAccount } = UsePutAccount(UseMutationCallbacks('Cuenta actualizada con éxito. Por favor vuelva a iniciar sesión', '/dashboard', closeLoading))

    const handleSubmit = (data: UserUpdate) => {
        setLoading(true)
        updateAccount(data)
    }

    return (
        <AccountForm defaultValues={defaultValuesAccount} onloading={loading} onSubmit={handleSubmit} />
    )
}