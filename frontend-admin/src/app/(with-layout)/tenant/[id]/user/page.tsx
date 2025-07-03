"use client"

import { useEffect } from "react"
import TenantUsersTable from "./Table"
import { Page } from "@/components/Shared/Page"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/Shared/PageHeader"
import NewActionButton from "@/components/Shared/NewActionButton"
import AddExistingTenantsUsers from "./components/AddExistingTenantsUsers"
import { UseGetTenantById } from "@/hooks/api/lexobot-ai/tenant/UseGetTenantById"

export default function TenantUsers() {
    const router = useRouter()
    const params = useParams()
    const tenantIdRaw = params?.id

    useEffect(() => {
        if (!tenantIdRaw || isNaN(Number(tenantIdRaw))) {
            router.replace('/tenant')
        }
    }, [tenantIdRaw, router])

    const tenantId = tenantIdRaw && !isNaN(Number(tenantIdRaw)) ? String(tenantIdRaw) : undefined

    const { data, isLoading, isError } = UseGetTenantById(tenantId)

    useEffect(() => {
        if (isError) {
            router.replace('/tenant')
        }
    }, [isError, router])

    const actionButtonCreateAssign = () => {
        return (
            <div className="flex flex-col gap-1 justify-end sm:flex-row sm:w-full">
                <NewActionButton path={`/tenant/${tenantId}/user/new`} title="Agregar nuevo" showIcon={false} className="w-full sm:w-[150px]" />
                <AddExistingTenantsUsers tenantId={Number(tenantId)} />
                <NewActionButton path={`/tenant/${tenantId}/user/assign`} title="Gestionar" showIcon={false} className="w-full sm:min-w-[150px]" />
            </div>
        )
    }

    return (
        <Page
            header={
                <PageHeader
                    title={`Usuarios asignados al tenant: ${isLoading ? '...' : data?.name}`}
                    actionButton={actionButtonCreateAssign()}
                />
            }
        >
            <TenantUsersTable tenantId={tenantId} />
        </Page>
    )
}