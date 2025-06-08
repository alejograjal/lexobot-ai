"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/context/AuthContext';
import { yupResolver } from "@hookform/resolvers/yup"
import { useCallback, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ButtonLoading } from "@/components/Button/ButonLoading"
import { LoginFormValues, loginSchema } from "@/app/login/LoginSchema"

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
            setTimeout(() => {
                setIsLoading(false)
            }, 200);
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
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit(createLoginWrapper)}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Welcome back</h1>
                                <p className="text-muted-foreground text-balance">
                                    Login to your LexoBot management account
                                </p>
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="username">Username</Label>
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
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
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
                    <div className="bg-muted relative hidden md:block">
                        <Image
                            src="/LexoBot-AI-simple.jpeg"
                            alt="Image"
                            fill
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
