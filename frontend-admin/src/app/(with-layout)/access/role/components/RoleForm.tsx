"use client"

import { Form, } from "@/components/ui/form"
import { Role, roleSchema } from "./RoleSchema"
import { DefaultValues } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { FormActions } from "@/components/Form/FormActions"
import { useForm, SubmitHandler, FieldValues } from "react-hook-form"
import { FormFieldWrapper } from "@/components/Form/FormFieldWrapper"

interface RoleFormProps {
    defaultValues?: DefaultValues<Role>
    onSubmit: SubmitHandler<Role>
    onloading: boolean
}

export function RoleForm({
    defaultValues,
    onSubmit,
    onloading
}: RoleFormProps) {
    const form = useForm<Role>({
        resolver: yupResolver(roleSchema),
        defaultValues,
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                <FormFieldWrapper name="name" label="Nombre" />
                <FormFieldWrapper name="description" label="Descripción" />

                <FormActions pathCancel="/access/role" isSaving={onloading} />
            </form>
        </Form>
    )
}