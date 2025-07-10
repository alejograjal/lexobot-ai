"use client";

import { useEffect, useState } from "react";
import { ErrorDetail } from "@/types/lexobot-ai";
import { UseSnackbar } from "@/stores/UseSnackbar";
import { useRouter, useSearchParams } from "next/navigation";
import ChangePasswordForm from "../components/ChangePasswordForm";
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks";
import { CircularLoadingProgress } from "@/components/Shared/CircularLoadingProgress";
import { ChangePasswordFormValues } from "@/app/auth/user/components/ChangePasswordSchema";
import { UsePostChangePassword } from "@/hooks/api/lexobot-ai/authentication/UsePostChangePassword";
import { UseGetVerifyResetPasswordToken } from "@/hooks/api/lexobot-ai/authentication/UseGetVerifyResetPasswordToken";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChangePasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const setSnackbarMessage = UseSnackbar((state) => state.setMessage);
    const [loading, setLoading] = useState(false);

    const closeLoading = () => setLoading(false);

    const { data: tokenValid, isLoading, isError, error } = UseGetVerifyResetPasswordToken(token)

    useEffect(() => {
        if (!token) {
            router.replace('/login')
        } else if (tokenValid === false) {
            router.replace('/login')
        }
    }, [token, tokenValid, router])

    useEffect(() => {
        if (isError) {
            setSnackbarMessage((error.data.error as ErrorDetail).message, 'error')
            router.replace('/login')
        }
    }, [isError, error, router, setSnackbarMessage])

    const { mutate: postChangePassword } = UsePostChangePassword({
        token: String(token),
        ...UseMutationCallbacks('Contraseña actualizada con éxito', '/login', closeLoading)
    })

    const handleSubmit = async (data: ChangePasswordFormValues) => {
        setLoading(true)
        await postChangePassword(data)
    }

    if (isLoading) return <CircularLoadingProgress />
    if (!token || tokenValid === false) return null

    return (
        <div>
            <div className="block sm:hidden mb-1 text-center px-4">
                <h1 className="text-primary text-xl font-bold mb-1">
                    Cambio de contraseña
                </h1>
                <h2 className="text-primary text-lg font-semibold">
                    Por favor, introduzca su nueva contraseña. No puede ser igual a ninguna de las 5 anteriores.
                </h2>
            </div>

            <Card className="hidden sm:block w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-primary text-xl text-center">
                        Cambio de contraseña
                    </CardTitle>
                    <CardDescription className="text-lg">
                        Por favor, introduzca su nueva contraseña. No puede ser igual a ninguna de las 5 anteriores.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChangePasswordForm onSubmit={handleSubmit} isLoading={loading} />
                </CardContent>
            </Card>

            <div className="block sm:hidden w-full px-4">
                <ChangePasswordForm onSubmit={handleSubmit} isLoading={loading} />
            </div>
        </div>
    )
}