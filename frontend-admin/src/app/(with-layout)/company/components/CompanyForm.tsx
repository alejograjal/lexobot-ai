"use client"

import { Form, } from "@/components/ui/form"
import { DefaultValues } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, SubmitHandler } from "react-hook-form"
import { FormActions } from "@/components/Form/FormActions"
import { companySchema, Company } from "./CompanySchema"
import { FormFieldWrapper } from "@/components/Form/FormFieldWrapper"
import { FormPhoneField } from "@/components/Form/FormInputPhone"

interface CompanyFormProps {
    defaultValues?: DefaultValues<Company>
    onSubmit: SubmitHandler<Company>
    onloading: boolean
}

export function CompanyForm({
    defaultValues,
    onSubmit,
    onloading
}: CompanyFormProps) {
    const form = useForm<Company>({
        resolver: yupResolver(companySchema),
        defaultValues,
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                <FormFieldWrapper name="name" label="Nombre" />
                <FormFieldWrapper name="email" label="Correo" />
                <FormFieldWrapper name="legal_id" label="Cédula" />
                <FormFieldWrapper name="address" label="Dirección" as="textarea" />
                <FormPhoneField name="phone" label="Teléfono" />
                <FormFieldWrapper name="billing_email" label="Correo de facturación" />

                <FormActions pathCancel="/company" isSaving={onloading} />
            </form>
        </Form>
    )
}