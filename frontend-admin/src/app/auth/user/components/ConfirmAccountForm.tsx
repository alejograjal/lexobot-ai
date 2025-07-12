'use client'

import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { useEffect, useMemo } from 'react'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2, Check, X } from 'lucide-react'
import { yupResolver } from '@hookform/resolvers/yup'
import { ButtonLoading } from '@/components/Button/ButtonLoading'
import { FormPhoneField } from '@/components/Form/FormInputPhone'
import { FormPasswordFieldWrapper } from '@/components/Form/FormPasswordFieldWrapper'
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

    const usernameSchema = confirmAccountSchema.fields.username as yup.StringSchema
    const isValidUsername = useMemo(() => {
        try {
            usernameSchema.validateSync(username)
            return true
        } catch {
            return false
        }
    }, [username, usernameSchema])

    const { data: usernameAvailable, isFetching: checkingUsername } = UseGetAvailabilityUserName(username, { enabled: isValidUsername })

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

                    <FormPasswordFieldWrapper name="password" label="Contraseña" showRules />
                    <FormPasswordFieldWrapper name="confirm_password" label="Confirmar contraseña" />

                    <ButtonLoading loading={isLoading} type="submit" className="w-full">
                        Confirmar cuenta
                    </ButtonLoading>
                </form>
            </Form>
        </div>
    )
}
