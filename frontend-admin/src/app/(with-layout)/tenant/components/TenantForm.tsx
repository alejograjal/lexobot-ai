"use client"

import { Form, } from "@/components/ui/form"
import { DefaultValues } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { tenantSchema, Tenant } from "./TenantSchema"
import { useForm, SubmitHandler } from "react-hook-form"
import { FormActions } from "@/components/Form/FormActions"
import { FormFieldWrapper } from "@/components/Form/FormFieldWrapper"
import { FormFieldNumberWrapper } from "@/components/Form/FormFieldNumberWrapper"

interface TenantFormProps {
    defaultValues?: DefaultValues<Tenant>
    onSubmit: SubmitHandler<Tenant>
    onloading: boolean
}

export function TenantForm({
    defaultValues,
    onSubmit,
    onloading
}: TenantFormProps) {
    const form = useForm<Tenant>({
        resolver: yupResolver(tenantSchema),
        defaultValues,
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                <FormFieldWrapper name="name" label="Nombre" />
                <FormFieldWrapper name="contact_name" label="Nombre de contacto" />
                <FormFieldWrapper name="external_id" label="Identificador externo" />
                <FormFieldWrapper name="contact_email" label="Email de contacto" />
                <FormFieldNumberWrapper name="client_count" label="Cantidad de consumidores" />

                <FormActions pathCancel="/tenant" isSaving={onloading} />
            </form>
        </Form>
    )
}