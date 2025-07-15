"use client"

import { Form, } from "@/components/ui/form"
import { DefaultValues } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, SubmitHandler } from "react-hook-form"
import { FormActions } from "@/components/Form/FormActions"
import { FormDatePicker } from "@/components/Form/FormDatePicker"
import { FormFieldWrapper } from "@/components/Form/FormFieldWrapper"
import { companyAccessSchema, CompanyAccess } from "./CompanyAccessSchema"

interface CompanyAccessFormProps {
    defaultValues?: DefaultValues<CompanyAccess>
    onSubmit: SubmitHandler<CompanyAccess>
    onloading: boolean
}

export function CompanyAccessForm({
    defaultValues,
    onSubmit,
    onloading
}: CompanyAccessFormProps) {
    const form = useForm<CompanyAccess>({
        resolver: yupResolver(companyAccessSchema),
        defaultValues,
    })

    // const { data: plans, isLoading, isError } = UseGetPlans()
    // const planOptions = createSelectOptions(plans, { valueField: 'id', labelField: 'name' });
    // const selectPlaceholder = isError ? "Error al cargar los planes" : isLoading ? "Cargando..." : "Seleccione un plan"

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                <FormFieldWrapper name="lexobot_worker_api_key" label="API Key" disabled />
                {/* <FormSelectWrapper name="plan_id" label="Plan" options={planOptions} placeholder={selectPlaceholder} disabled={isLoading || isError} /> */}
                <FormDatePicker name="issue_at" label="Fecha de adquisición" />
                <FormDatePicker name="expires_at" label="Fecha de vencimiento" />
                {/* <FormSwitch name="auto_renewal" label="Renovación automática" /> */}

                <FormActions pathCancel="/company" isSaving={onloading} />
            </form>
        </Form>
    )
}