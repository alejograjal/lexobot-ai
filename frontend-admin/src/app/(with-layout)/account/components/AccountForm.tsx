"use client"

import { useEffect } from "react"
import { Form, } from "@/components/ui/form"
import { DefaultValues } from "react-hook-form"
import { createSelectOptions } from "@/lib/utils"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, SubmitHandler } from "react-hook-form"
import { accountSchema, Account } from "./AccountSchema"
import { FormActions } from "@/components/Form/FormActions"
import { FormPhoneField } from "@/components/Form/FormInputPhone"
import { FormFieldWrapper } from "@/components/Form/FormFieldWrapper"
import { UseGetRoles } from "@/hooks/api/lexobot-ai/role/UseGetRoles"
import { FormSelectWrapper } from "@/components/Form/FormSelectWrapper"

interface AccountFormProps {
    defaultValues?: DefaultValues<Account>
    onSubmit: SubmitHandler<Account>
    onloading: boolean
}

export function AccountForm({
    defaultValues,
    onSubmit,
    onloading
}: AccountFormProps) {
    const form = useForm<Account>({
        resolver: yupResolver(accountSchema),
        defaultValues,
    })

    useEffect(() => {
        if (defaultValues) {
            form.reset(defaultValues);
        }
    }, [defaultValues, form]);

    const { data: roles, isLoading, isError } = UseGetRoles()
    const roleOptions = createSelectOptions(roles, { valueField: 'id', labelField: 'name' });
    const selectPlaceholder = isError ? "Error al cargar los roles" : isLoading ? "Cargando..." : "Seleccione un rol"

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                <FormFieldWrapper name="first_name" label="Nombre" />
                <FormFieldWrapper name="last_name" label="Apellidos" />
                <FormPhoneField name="phone_number" label="Teléfono" />
                <FormFieldWrapper name="username" label="Nombre de usuario" disabled />
                <FormFieldWrapper name="email" label="Correo" disabled />
                <FormSelectWrapper name="role_id" label="Rol" options={roleOptions} placeholder={selectPlaceholder} disabled />

                <FormActions pathCancel="/dashboard" isSaving={onloading} />
            </form>
        </Form>
    )
}