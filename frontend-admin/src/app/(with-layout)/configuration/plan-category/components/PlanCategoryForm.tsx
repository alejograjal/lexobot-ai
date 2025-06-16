"use client"

import { Form, } from "@/components/ui/form"
import { DefaultValues } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, SubmitHandler } from "react-hook-form"
import { FormActions } from "@/components/Form/FormActions"
import { FormFieldWrapper } from "@/components/Form/FormFieldWrapper"
import { PlanCategory, planCategorySchema } from "./PlanCategorySchema"

interface PlanCategoryFormProps {
    defaultValues?: DefaultValues<PlanCategory>
    onSubmit: SubmitHandler<PlanCategory>
    onloading: boolean
}

export function PlanCategoryForm({
    defaultValues,
    onSubmit,
    onloading
}: PlanCategoryFormProps) {
    const form = useForm<PlanCategory>({
        resolver: yupResolver(planCategorySchema),
        defaultValues,
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                <FormFieldWrapper name="name" label="Nombre" />
                <FormFieldWrapper name="description" label="Descripción" />

                <FormActions pathCancel="/configuration/plan-category" isSaving={onloading} />
            </form>
        </Form>
    )
}