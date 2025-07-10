"use client"

import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/context/AuthContext';
import { yupResolver } from "@hookform/resolvers/yup"
import { useCallback, useEffect, useState } from "react"
import { loginSchema, LoginFormValues } from "./LoginFullSchema"
import { ButtonLoading } from "@/components/Button/ButtonLoading"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { login, isAuthenticated } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: yupResolver(loginSchema),
    })

    const createLoginWrapper = useCallback(
        async (data: LoginFormValues) => {
            setIsLoading(true)
            await login(data)
            setIsLoading(false)
        },
        [login]
    )

    useEffect(() => {
        if (isAuthenticated) {
            setIsLoading(false)
            router.replace('/dashboard');
        }
    }, [isAuthenticated, router])

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl text-center">Bienvenido</CardTitle>
                    <CardDescription>
                        Accede a tu cuenta de administración de LexoBot
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(createLoginWrapper)}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="username">Nombre de usuario</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    {...register("username")}
                                />
                                {errors.username && (
                                    <p className="text-sm text-red-500">{errors.username.message}</p>
                                )}
                            </div>

                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <Link
                                        href="/auth/user/password/recover"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="contraseña"
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <ButtonLoading type="submit" loading={isLoading} className="w-full">
                                Ingresar
                            </ButtonLoading>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
