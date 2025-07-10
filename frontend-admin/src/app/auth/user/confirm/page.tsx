'use client'

import { useEffect, useState } from "react"
import { UseSnackbar } from "@/stores/UseSnackbar"
import { ErrorDetail } from "@/types/lexobot-ai"
import { useRouter, useSearchParams } from "next/navigation"
import ConfirmAccountForm from "../components/ConfirmAccountForm"
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks"
import { ConfirmAccountFormValues } from "../components/ConfirmAccountSchema"
import { CircularLoadingProgress } from "@/components/Shared/CircularLoadingProgress"
import { UseGetVerifyConfirmationToken } from "@/hooks/api/lexobot-ai/authentication/UseGetVerifyConfirmationToken"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UsePostConfirmUserAccount } from "@/hooks/api/lexobot-ai/authentication/UsePostConfirmUserAccount"

export default function ConfirmAccountPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const setSnackbarMessage = UseSnackbar((state) => state.setMessage);
    const [loading, setLoading] = useState(false);

    const closeLoading = () => setLoading(false);

    const { data: tokenValid, isLoading, isError, error } = UseGetVerifyConfirmationToken(token)

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

    const { mutate: postConfirmUserAccount } = UsePostConfirmUserAccount({
        token: String(token),
        ...UseMutationCallbacks('Cuenta confirmada con éxito', '/login', closeLoading)
    })

    const handleSubmit = async (data: ConfirmAccountFormValues) => {
        setLoading(true)
        await postConfirmUserAccount(data)
    }

    if (isLoading) return <CircularLoadingProgress />
    if (!token || tokenValid === false) return null

    return (
        <div>
            <div className="block sm:hidden mb-1 text-center px-4">
                <h1 className="text-primary text-xl font-bold mb-1">
                    Confirmar cuenta
                </h1>
                <h2 className="text-primary text-lg font-semibold">
                    Estás a un paso de ser parte de la familia <span className="text-indigo-600">LexoBot</span>
                </h2>
            </div>

            <Card className="hidden sm:block w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-primary text-xl text-center">
                        Confirmar cuenta
                    </CardTitle>
                    <CardDescription className="text-lg">
                        Estás a un paso de ser parte de la familia <span className="text-indigo-600">LexoBot</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ConfirmAccountForm onSubmit={handleSubmit} isLoading={loading} />
                </CardContent>
            </Card>

            <div className="block sm:hidden w-full px-4">
                <ConfirmAccountForm onSubmit={handleSubmit} isLoading={loading} />
            </div>
        </div>
    )
}
