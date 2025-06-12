"use client"

import { useState } from "react"
import { Page } from "@/components/Shared/Page"
import { PageHeader } from "@/components/Shared/PageHeader"
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks"
import { Tenant, initialValues } from "../components/TenantSchema"
import { UsePostTenant } from "@/hooks/api/lexobot-ai/tenant/UsePostTenant"
import { TenantForm } from "@/app/(with-layout)/tenant/components/TenantForm"

export default function CreateTenantPage() {
    const [loading, setLoading] = useState(false);

    const closeLoading = () => setLoading(false);

    const { mutate: postTenant } = UsePostTenant(UseMutationCallbacks('Tenant creado correctamente', '/tenant', closeLoading));

    const handleSubmit = (data: Tenant) => {
        postTenant({ ...data });
    }

    return (
        <Page
            header={
                <PageHeader
                    title="Crear tenant nuevo"
                    subtitle="Por favor llene todos los campos"
                />
            }
        >
            <TenantForm
                defaultValues={initialValues}
                onSubmit={handleSubmit}
                onloading={loading}
            />
        </Page>
    )
}
