"use client"

import { AnyObjectSchema } from "yup"
import { Form, } from "@/components/ui/form"
import { DefaultValues } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { FormActions } from "@/components/Form/FormActions"
import { useForm, SubmitHandler, FieldValues } from "react-hook-form"
import { FormFieldWrapper } from "@/components/Form/FormFieldWrapper"

interface CompanyFormProps<T extends FieldValues> {
    schema: AnyObjectSchema
    defaultValues?: DefaultValues<T>
    onSubmit: SubmitHandler<T>
    onloading: boolean
}

export function CompanyForm<T extends FieldValues>({
    schema,
    defaultValues,
    onSubmit,
    onloading
}: CompanyFormProps<T>) {
    const form = useForm<T>({
        resolver: yupResolver(schema),
        defaultValues,
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                <FormFieldWrapper name="name" label="Nombre" />
                <FormFieldWrapper name="email" label="Correo" />
                <FormFieldWrapper name="legal_id" label="Cédula" />
                <FormFieldWrapper name="address" label="Dirección" as="textarea" />
                <FormFieldWrapper name="phone" label="Teléfono" />
                <FormFieldWrapper name="billing_email" label="Correo de facturación" />

                <FormActions pathCancel="/company" isSaving={onloading} />
            </form>
        </Form>
    )
}