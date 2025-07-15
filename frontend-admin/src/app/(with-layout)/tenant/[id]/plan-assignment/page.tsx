"use client";

import { useEffect, useState } from "react";
import { formatErrorMessage } from "@/lib/utils";
import { UseSnackbar } from "@/stores/UseSnackbar";
import { useParams, useRouter } from "next/navigation";
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks";
import { Roles, TenantPlanAssignmentResponse } from "@/types/lexobot-ai";
import { TenantPlanAssignmentForm } from "./components/TenantPlanAssignmentForm";
import { CircularLoadingProgress } from "@/components/Shared/CircularLoadingProgress";
import { UsePutTenantPlanAssignment } from "@/hooks/api/lexobot-ai/tenantPlanAssignment/UsePutCompanyAccess";
import { UsePostTenantPlanAssignment } from "@/hooks/api/lexobot-ai/tenantPlanAssignment/UsePostCompanyAccess";
import { UseGetTenantPlanAssignments } from "@/hooks/api/lexobot-ai/tenantPlanAssignment/UseGetCompanyAccesses";
import { TenantPlanAssignment as TenantPlanAssignmentSchema, initialValues } from "./components/TenantPlanAssignmentSchema";

function mapTenantPlanAssignmentToDto(data: TenantPlanAssignmentSchema) {
    return {
        ...data,
        plan_id: data.planId,
        assigned_at: data.assigned_at.toISOString(),
        expires_at: data.expires_at.toISOString(),
    }
}

function mapTenantPlanAssignmentToForm(data: TenantPlanAssignmentResponse) {
    return {
        planId: data.plan_id,
        assigned_at: data.assigned_at ? new Date(data.assigned_at) : undefined,
        expires_at: data.expires_at ? new Date(data.expires_at) : undefined,
        auto_renewal: data.auto_renewal
    }
}

export default function TenantPlanAssignment() {
    const router = useRouter()
    const params = useParams()
    const setSnackbarMessage = UseSnackbar((state) => state.setMessage)

    const tenantIdRaw = params?.id

    useEffect(() => {
        if (!tenantIdRaw || isNaN(Number(tenantIdRaw))) {
            router.replace('/tenant')
        }
    }, [tenantIdRaw, router])

    const tenantId = tenantIdRaw && !isNaN(Number(tenantIdRaw)) ? String(tenantIdRaw) : undefined

    const [loading, setLoading] = useState(false)
    const closeLoading = () => setLoading(false)

    const { data: tenantPlanAssignments, isLoading, isError, error: errorAPI } = UseGetTenantPlanAssignments(tenantId)

    const existsAccess = tenantPlanAssignments && tenantPlanAssignments.length > 0

    const { mutate: postCompanyAccess } = UsePostTenantPlanAssignment({
        tenantId: Number(tenantId),
        ...UseMutationCallbacks('Asignación de plan creado correctamente', '/tenant', closeLoading)
    })

    const { mutate: putCompanyAccess } = UsePutTenantPlanAssignment({
        tenantId: Number(tenantId),
        assignmentId: Number(existsAccess ? tenantPlanAssignments![0].id : 0),
        ...UseMutationCallbacks('Asignación de plan actualizado correctamente', '/tenant', closeLoading)
    })

    const handleSubmit = async (data: TenantPlanAssignmentSchema) => {

        setLoading(true)
        const payload = mapTenantPlanAssignmentToDto(data)

        if (!existsAccess) {
            postCompanyAccess(payload)
            return;
        }

        await putCompanyAccess(payload)
    }

    useEffect(() => {
        if (isError) {
            const { error } = errorAPI.data
            setSnackbarMessage(formatErrorMessage(error), 'error')
            router.replace('/tenant')
        }
    }, [isError, errorAPI, router, setSnackbarMessage])

    return (
        <>
            <div className="flex items-center my-8 max-w-md">
                <div className="flex-grow border-t border-gray-300" />
                <span className="mx-4 text-gray-500 text-sm">Plan</span>
                <div className="flex-grow border-t border-gray-300" />
            </div>

            {isLoading ? (
                <CircularLoadingProgress />
            ) : (
                <TenantPlanAssignmentForm
                    defaultValues={existsAccess ? mapTenantPlanAssignmentToForm(tenantPlanAssignments[0]) : initialValues}
                    onSubmit={handleSubmit}
                    onloading={loading}
                />
            )}
        </>
    )
}