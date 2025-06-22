"use client"

import { useEffect, useState } from "react"
import { Page } from "@/components/Shared/Page"
import { PageHeader } from "@/components/Shared/PageHeader"
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks"
import { TenantDocument, initialValues } from "../components/DocumentSchema"
import { UsePostTenant } from "@/hooks/api/lexobot-ai/tenant/UsePostTenant"
import { TenantForm } from "@/app/(with-layout)/tenant/components/TenantForm"
import { useParams, useRouter } from "next/navigation"
import { UseGetTenantById } from "@/hooks/api/lexobot-ai/tenant/UseGetTenantById"
import { TenantDocumentForm } from "../components/TenantDocumentForm"
import { UsePostTenantDocument } from "@/hooks/api/lexobot-ai/tenantDocument/UsePostTenantDocument"

export default function CreateDocument() {
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

    const [loading, setLoading] = useState(false);

    const closeLoading = () => setLoading(false);

    const { mutate: postTenant } = UsePostTenantDocument({
        tenantId: Number(tenantId),
        ...UseMutationCallbacks('Documento cargado correctamente', `/tenant/${tenantId}/document`, closeLoading)
    });

    const handleSubmit = (data: TenantDocument) => {
        postTenant({ ...data });
    }

    return (
        <Page
            header={
                <PageHeader
                    title={`Agregar documento nuevo tenant: ${isLoading ? '...' : data?.name}`}
                    subtitle="Por favor llene todos los campos"
                />
            }
        >
            <TenantDocumentForm defaultValues={initialValues} onSubmit={handleSubmit} onloading={loading} />
        </Page>
    )
}
