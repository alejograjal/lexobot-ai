"use client"

import { Form, } from "@/components/ui/form"
import { DefaultValues } from "react-hook-form"
import { createSelectOptions } from "@/lib/utils"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, SubmitHandler } from "react-hook-form"
import { FormSwitch } from "@/components/Form/FormSwitch"
import { FormActions } from "@/components/Form/FormActions"
import { FormDatePicker } from "@/components/Form/FormDatePicker"
import { UseGetPlans } from "@/hooks/api/lexobot-ai/plan/UseGetPlans"
import { FormSelectWrapper } from "@/components/Form/FormSelectWrapper"
import { tenantPlanAssignmentSchema, TenantPlanAssignment } from "./TenantPlanAssignmentSchema"
import { useAuth } from "@/context/AuthContext"
import { Roles } from "@/types/lexobot-ai"

interface TenantPlanAssignmentFormProps {
    defaultValues?: DefaultValues<TenantPlanAssignment>
    onSubmit: SubmitHandler<TenantPlanAssignment>
    onloading: boolean
}

export function TenantPlanAssignmentForm({
    defaultValues,
    onSubmit,
    onloading
}: TenantPlanAssignmentFormProps) {
    const { userProfile } = useAuth();

    const isAdmin = userProfile?.role.name as Roles === 'Administrator'

    const form = useForm<TenantPlanAssignment>({
        resolver: yupResolver(tenantPlanAssignmentSchema),
        defaultValues,
    })

    const { data: plans, isLoading, isError } = UseGetPlans()
    const planOptions = createSelectOptions(plans, { valueField: 'id', labelField: 'name' });
    const selectPlaceholder = isError ? "Error al cargar los planes" : isLoading ? "Cargando..." : "Seleccione un plan"

    const selectedPlanId = form.watch("planId");
    const selectedPlan = plans?.find(plan => plan.id == selectedPlanId);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                <FormSelectWrapper name="planId" label="Plan" options={planOptions} placeholder={selectPlaceholder} disabled={isLoading || isError || !isAdmin} />

                {selectedPlan && (
                    <div className="text-sm text-muted-foreground space-y-1 border border-border bg-muted px-4 py-2 rounded-xl">
                        <div><strong>Precio base:</strong> ${selectedPlan.base_price}</div>
                        <div><strong>Máx. asociados:</strong> {selectedPlan.max_associates}</div>
                    </div>
                )}

                <FormDatePicker name="assigned_at" label="Fecha de adquisición" disabled={!isAdmin} />
                <FormDatePicker name="expires_at" label="Fecha de vencimiento" disabled={!isAdmin} />
                <FormSwitch name="auto_renewal" label="Renovación automática" disabled={!isAdmin} />

                <FormActions pathCancel="/tenant" isSaving={onloading} disabled={!isAdmin} />
            </form>
        </Form>
    )
}