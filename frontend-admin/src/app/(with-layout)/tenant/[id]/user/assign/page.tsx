"use client";

import { useEffect } from "react";
import AssignTable from "./AssignTable";
import { Page } from "@/components/Shared/Page";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/Shared/PageHeader";
import { UseGetCompanyById } from "@/hooks/api/lexobot-ai/company/UseGetCompanyById";
import { UseGetTenantById } from "@/hooks/api/lexobot-ai/tenant/UseGetTenantById";

export default function AssignUser() {
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

    return (
        <Page
            header={
                <PageHeader
                    title={`Asignación de usuarios del tenant: ${isLoading ? '...' : data?.name}`}
                    subtitle="Solo puede agregar usuarios con rol 'Tenant'"
                />
            }
        >
            <AssignTable tenantId={tenantId} />
        </Page>
    )
}