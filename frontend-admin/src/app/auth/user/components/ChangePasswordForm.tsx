"use client";

import { useForm } from "react-hook-form";
import { ChangePasswordFormValues, changePasswordSchema } from "./ChangePasswordSchema"
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "@/components/ui/form";
import { FormFieldWrapper } from "@/components/Form/FormFieldWrapper";
import { FormActions } from "@/components/Form/FormActions";

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
                    <FormFieldWrapper name="new_password" type='password' label="Contraseña nueva" />
                    <FormFieldWrapper name="confirm_password" type='password' label="Confirmar contraseña nueva" />

                    <FormActions pathCancel="/login" isSaving={isLoading} />
                </form>
            </Form>
        </div>
    )
}