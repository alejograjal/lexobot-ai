"use client"

import { useForm } from "react-hook-form"
import { Form } from '@/components/ui/form'
import { yupResolver } from "@hookform/resolvers/yup"
import { FormActions } from "@/components/Form/FormActions"
import { PasswordChangeValues, passwordChangeSchema } from "./PasswordChangeSchema"
import { FormPasswordFieldWrapper } from "@/components/Form/FormPasswordFieldWrapper"

interface PasswordChangeForm {
    onSubmit: (data: PasswordChangeValues) => void
    onloading: boolean
}

export default function PasswordChangeForm({
    onSubmit,
    onloading
}: PasswordChangeForm) {
    const form = useForm<PasswordChangeValues>({
        resolver: yupResolver(passwordChangeSchema),
        defaultValues: {
            current_password: '',
            new_password: '',
            confirm_password: '',
        }
    })

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                    <FormPasswordFieldWrapper name="current_password" label="Contraseña actual" />
                    <FormPasswordFieldWrapper name="new_password" label="Contraseña" showRules />
                    <FormPasswordFieldWrapper name="confirm_password" label="Confirmar Contraseña" />

                    <FormActions pathCancel="/dashboard" isSaving={onloading} />
                </form>
            </Form>
        </div>
    )
}