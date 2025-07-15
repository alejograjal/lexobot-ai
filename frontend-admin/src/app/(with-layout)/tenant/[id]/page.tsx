"use client"

import type { InferType } from "yup"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { DeleteTenant } from "./DeleteTenant"
import { Page } from "@/components/Shared/Page"
import { formatErrorMessage } from "@/lib/utils"
import { UseSnackbar } from "@/stores/UseSnackbar"
import { Tenant } from "../components/TenantSchema"
import { PageHeader } from "@/components/Shared/PageHeader"
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks"
import { UsePutTenant } from "@/hooks/api/lexobot-ai/tenant/UsePutTenant"
import { TenantForm } from "@/app/(with-layout)/tenant/components/TenantForm"
import { UseGetTenantById } from "@/hooks/api/lexobot-ai/tenant/UseGetTenantById"
import { CircularLoadingProgress } from "@/components/Shared/CircularLoadingProgress"
import TenantPlanAssignment from "./plan-assignment/page"

export default function UpdateTenantPage() {
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

    const { data, isLoading, isError, error: errorAPI } = UseGetTenantById(tenantId)

    const { mutate: putTenant } = UsePutTenant({
        tenantId: Number(tenantId),
        ...UseMutationCallbacks('Tenant actualizado correctamente', '/tenant', closeLoading)
    })

    useEffect(() => {
        if (isError) {
            const { error } = errorAPI.data
            setSnackbarMessage(formatErrorMessage(error), 'error')
            router.replace('/tenant')
        }
    }, [isError, errorAPI, router, setSnackbarMessage])

    const handleSubmit = async (data: Tenant) => {
        setLoading(true)
        await putTenant({ ...data })
    }

    return (
        <Page
            header={
                <PageHeader
                    title={`Editar tenant ${data?.name}`}
                    subtitle="Actualice los campos que desee"
                    actionButton={<DeleteTenant tenantId={Number(tenantId)} tenantName={data?.name!} />}
                />
            }

        >
            {isLoading ? (
                <CircularLoadingProgress />
            ) : (
                <>
                    <TenantForm
                        defaultValues={data ?? undefined}
                        onSubmit={handleSubmit}
                        onloading={loading}
                    />
                    <TenantPlanAssignment />
                </>

            )}

        </Page>
    )
}
