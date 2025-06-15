"use client"

import { Form, } from "@/components/ui/form"
import { Plan, planSchema } from "./PlanSchema"
import { DefaultValues } from "react-hook-form"
import { createSelectOptions } from "@/lib/utils"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, SubmitHandler } from "react-hook-form"
import { FormActions } from "@/components/Form/FormActions"
import { FormFieldWrapper } from "@/components/Form/FormFieldWrapper"
import { FormSelectWrapper } from "@/components/Form/FormSelectWrapper"
import { FormCurrencyInput } from "@/components/Form/FormCurrencyInput"
import { FormFieldNumberWrapper } from "@/components/Form/FormFieldNumberWrapper"
import { UseGetPlanCategories } from "@/hooks/api/lexobot-ai/planCategory/UseGetPlanCategories"

interface PlanFormProps {
    defaultValues?: DefaultValues<Plan>
    onSubmit: SubmitHandler<Plan>
    onloading: boolean
}

export function PlanForm({
    defaultValues,
    onSubmit,
    onloading
}: PlanFormProps) {
    const form = useForm<Plan>({
        resolver: yupResolver(planSchema),
        defaultValues,
    })

    const { data: planCategories, isLoading, isError } = UseGetPlanCategories()
    const planCategoryOptions = createSelectOptions(planCategories, { valueField: 'id', labelField: 'name' });
    const selectPlaceholder = isError ? "Error al cargar las categorías" : isLoading ? "Cargando..." : "Seleccione una categoría"

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                <FormFieldWrapper name="name" label="Nombre" />
                <FormCurrencyInput name="base_price" label="Precio base" />
                <FormFieldNumberWrapper name="max_tenants" label="Cantidad máxima de tenants" />
                <FormSelectWrapper name="plan_category_id" label="Categoría de plan" options={planCategoryOptions} placeholder={selectPlaceholder} disabled={isLoading || isError} />

                <FormActions pathCancel="/configuration/plan" isSaving={onloading} />
            </form>
        </Form>
    )
}