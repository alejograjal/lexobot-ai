"use client"

import { Form, } from "@/components/ui/form"
import { User, userSchema } from "./UserSchema"
import { DefaultValues } from "react-hook-form"
import { createSelectOptions } from "@/lib/utils"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, SubmitHandler } from "react-hook-form"
import { FormActions } from "@/components/Form/FormActions"
import { FormPhoneField } from "@/components/Form/FormInputPhone"
import { FormFieldWrapper } from "@/components/Form/FormFieldWrapper"
import { UseGetRoles } from "@/hooks/api/lexobot-ai/role/UseGetRoles"
import { FormSelectWrapper } from "@/components/Form/FormSelectWrapper"
import { useEffect } from "react"

interface UserFormProps {
    defaultValues?: DefaultValues<User>
    onSubmit: SubmitHandler<User>
    onloading: boolean
    cancelPath?: string
    disableRole?: boolean
}

export function UserForm({
    defaultValues,
    onSubmit,
    onloading,
    cancelPath = "/access/user",
    disableRole = false
}: UserFormProps) {
    const form = useForm<User>({
        resolver: yupResolver(userSchema),
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
                <FormFieldWrapper name="email" label="Correo electrónico" />
                <FormSelectWrapper name="role_id" label="Rol" options={roleOptions} placeholder={selectPlaceholder} disabled={isLoading || isError || disableRole} />

                <FormActions pathCancel={cancelPath} isSaving={onloading} />
            </form>
        </Form>
    )
}