'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2, Check, X } from 'lucide-react'
import { yupResolver } from '@hookform/resolvers/yup'
import { ButtonLoading } from '@/components/Button/ButtonLoading'
import { FormPhoneField } from '@/components/Form/FormInputPhone'
import { FormFieldWrapper } from '@/components/Form/FormFieldWrapper'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { UseGetAvailabilityUserName } from '@/hooks/api/lexobot-ai/authentication/UseGetAvailabilityUserName'
import { confirmAccountSchema, ConfirmAccountFormValues } from '@/app/auth/user/components/ConfirmAccountSchema'

type ConfirmAccountFormProps = {
    onSubmit: (data: ConfirmAccountFormValues) => void
    isLoading: boolean
}

export default function ConfirmAccountForm({ onSubmit, isLoading = false }: ConfirmAccountFormProps) {
    const form = useForm<ConfirmAccountFormValues>({
        resolver: yupResolver(confirmAccountSchema),
        defaultValues: {
            username: '',
            phone_number: '',
            password: '',
            confirm_password: ''
        }
    })

    const username = form.watch('username')
    const { data: usernameAvailable, isFetching: checkingUsername } = UseGetAvailabilityUserName(username)

    useEffect(() => {
        if (usernameAvailable === false) {
            form.setError("username", {
                type: "manual",
                message: "Este nombre de usuario no está disponible.",
            })
        } else {
            form.clearErrors("username")
        }
    }, [username, usernameAvailable, form])

    return (
        <div className="max-w-md mx-auto p-6 sm:p-1">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre de usuario</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input placeholder="Ej. mi_usuario" {...field} />
                                    </FormControl>
                                    <div className="absolute right-2 top-2.5">
                                        {checkingUsername && <Loader2 className="animate-spin w-4 h-4 text-muted-foreground" />}
                                        {!checkingUsername && username.length >= 6 && usernameAvailable === true && (
                                            <Check className="text-green-600 w-4 h-4" />
                                        )}
                                        {!checkingUsername && username.length >= 6 && usernameAvailable === false && (
                                            <X className="text-red-600 w-4 h-4" />
                                        )}
                                    </div>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormPhoneField name="phone_number" label="Teléfono" />

                    <FormFieldWrapper name="password" type='password' label="Contraseña" />
                    <FormFieldWrapper name="confirm_password" type='password' label="Confirmar contraseña" />


                    <ButtonLoading loading={isLoading} type="submit" className="w-full">
                        Confirmar cuenta
                    </ButtonLoading>
                </form>
            </Form>
        </div>
    )
}
