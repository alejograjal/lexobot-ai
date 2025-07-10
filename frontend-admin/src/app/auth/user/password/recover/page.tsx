"use client";

import { useState } from "react";
import { ErrorDetail } from "@/types/lexobot-ai";
import { UseSnackbar } from "@/stores/UseSnackbar";
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks";
import ResetPasswordForm from "@/app/auth/user/components/ResetPasswordForm";
import { ResetPasswordFormValues } from "@/app/auth/user/components/ResetPasswordSchema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsePostResetPassword } from "@/hooks/api/lexobot-ai/authentication/UsePostResetPassword";

export default function ResetPassword() {
    const [loading, setLoading] = useState(false);

    const closeLoading = () => setLoading(false);

    const { mutate: postResetPassword } = UsePostResetPassword(UseMutationCallbacks('Contraseña restablecida con éxito, por favor verifique su correo electrónico', '/login', closeLoading))

    const handleSubmit = async (data: ResetPasswordFormValues) => {
        setLoading(true)
        await postResetPassword(data)
    }

    return (
        <div>
            <div className="block sm:hidden mb-1 text-center px-4">
                <h1 className="text-primary text-xl font-bold mb-1">
                    Restablecer contraseña
                </h1>
                <h2 className="text-muted-foreground text-sm">
                    Por favor, introduzca su correo electrónico.
                    Una vez verificado, le enviaremos un enlace para restablecer su contraseña.
                </h2>
            </div>

            <Card className="hidden sm:block w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-primary text-xl text-center">
                        Restablecer contraseña
                    </CardTitle>
                    <CardDescription className="text-sm">
                        Por favor, introduzca su correo electrónico.
                        Una vez verificado, le enviaremos un enlace para restablecer su contraseña.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResetPasswordForm onSubmit={handleSubmit} isLoading={loading} />
                </CardContent>
            </Card>

            <div className="block sm:hidden w-full px-4">
                <ResetPasswordForm onSubmit={handleSubmit} isLoading={loading} />
            </div>
        </div>
    )
}