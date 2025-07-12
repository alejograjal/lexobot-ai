"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormActions } from "@/components/Form/FormActions";
import { FormFieldWrapper } from "@/components/Form/FormFieldWrapper";
import { FormPasswordFieldWrapper } from "@/components/Form/FormPasswordFieldWrapper";
import { ChangePasswordFormValues, changePasswordSchema } from "./ChangePasswordSchema"

type ChangePasswordFormProps = {
    onSubmit: (data: ChangePasswordFormValues) => void
    isLoading: boolean
}

export default function ChangePasswordForm({ onSubmit, isLoading = false }: ChangePasswordFormProps) {
    const form = useForm<ChangePasswordFormValues>({
        resolver: yupResolver(changePasswordSchema),
        defaultValues: {
            email: '',
            new_password: '',
            confirm_password: '',
        }
    })

    return (
        <div className="max-w-md mx-auto p-6 sm:p-1">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormFieldWrapper name="email" label="Correo electrónico" />
                    <FormPasswordFieldWrapper name="new_password" label="Contraseña nueva" showRules />
                    <FormPasswordFieldWrapper name="confirm_password" label="Confirmar contraseña nueva" />

                    <FormActions pathCancel="/login" isSaving={isLoading} />
                </form>
            </Form>
        </div>
    )
}