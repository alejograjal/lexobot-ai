"use client"

import { useForm } from "react-hook-form"
import { Form } from '@/components/ui/form'
import { yupResolver } from "@hookform/resolvers/yup"
import { FormActions } from "@/components/Form/FormActions"
import { FormFieldWrapper } from "@/components/Form/FormFieldWrapper"
import { ResetPasswordFormValues, resetPasswordSchema } from "./ResetPasswordSchema"

type ResetPasswordFormProps = {
    onSubmit: (data: ResetPasswordFormValues) => void
    isLoading?: boolean
}

export default function ResetPasswordForm({ onSubmit, isLoading = false }: ResetPasswordFormProps) {
    const form = useForm<ResetPasswordFormValues>({
        resolver: yupResolver(resetPasswordSchema),
        defaultValues: {
            email: '',
        }
    })

    return (
        <div className="max-w-md mx-auto p-6 sm:p-1">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormFieldWrapper name="email" label="Correo electrónico" />

                    <FormActions pathCancel="/login" isSaving={isLoading} />
                </form>
            </Form>
        </div>
    )
}