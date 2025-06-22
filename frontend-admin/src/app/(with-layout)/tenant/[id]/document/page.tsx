"use client";

import TenantTable from "./Table";
import { useEffect } from "react";
import { Page } from "@/components/Shared/Page";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/Shared/PageHeader";
import NewActionButton from "@/components/Shared/NewActionButton";
import { UseGetTenantById } from "@/hooks/api/lexobot-ai/tenant/UseGetTenantById";

export default function TenantDocument() {
    const router = useRouter()
    const params = useParams()
    const tenantIdRaw = params?.id

    useEffect(() => {
        if (!tenantIdRaw || isNaN(Number(tenantIdRaw))) {
            router.replace(`/tenant/${tenantIdRaw}`)
        }
    }, [tenantIdRaw, router])

    const tenantId = tenantIdRaw && !isNaN(Number(tenantIdRaw)) ? String(tenantIdRaw) : undefined

    const { data, isLoading, isError } = UseGetTenantById(tenantId)

    useEffect(() => {
        if (isError) {
            router.replace(`/tenant/${tenantIdRaw}`)
        }
    }, [isError, router, tenantIdRaw])

    return (
        <Page
            header={
                <PageHeader
                    title={`Documentos del tenant: ${isLoading ? '...' : data?.name}`}
                    actionButton={<NewActionButton path={`/tenant/${tenantId}/document/new`} title="Agregar documento" />}
                />
            }
        >
            <TenantTable />
        </Page>
    )
}