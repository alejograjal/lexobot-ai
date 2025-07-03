"use client"

import { useEffect, useState } from "react"
import { Page } from "@/components/Shared/Page"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/Shared/PageHeader"
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks"
import { UserForm } from "@/app/(with-layout)/access/user/components/UserForm"
import { UseGetTenantById } from "@/hooks/api/lexobot-ai/tenant/UseGetTenantById"
import { UsePostTenantUser } from "@/hooks/api/lexobot-ai/tenant/UsePostTenantUser"
import { initialValues, User } from "@/app/(with-layout)/access/user/components/UserSchema"

export default function CreateTenantUserPage() {
    const router = useRouter()
    const params = useParams()
    const tenantIdRaw = params?.id
    const [loading, setLoading] = useState(false);

    const closeLoading = () => setLoading(false);

    useEffect(() => {
        if (!tenantIdRaw || isNaN(Number(tenantIdRaw))) {
            router.replace('/tenant')
        }
    }, [tenantIdRaw, router])

    const tenantId = tenantIdRaw && !isNaN(Number(tenantIdRaw)) ? String(tenantIdRaw) : undefined;

    const { data, isLoading, isError } = UseGetTenantById(tenantId)

    useEffect(() => {
        if (isError) {
            router.replace('/tenant')
        }
    }, [isError, router])

    initialValues.role_id = 3;

    const { mutate: postTenant } = UsePostTenantUser({ tenantId: Number(tenantId), ...UseMutationCallbacks('Usuario creado y asignado correctamente', `/tenant/${tenantId}/user`, closeLoading) });

    const handleSubmit = (data: User) => {
        postTenant({ user: data, assign: true });
    }

    return (
        <Page
            header={
                <PageHeader
                    title={`Crear usuario nuevo para el tenant: ${isLoading ? '...' : data?.name}`}
                    subtitle="Por favor llene todos los campos"
                />
            }
        >
            <UserForm
                defaultValues={initialValues}
                onSubmit={handleSubmit}
                onloading={loading}
                cancelPath={`/tenant/${tenantId}/user`}
                disableRole
            />
        </Page>
    )
}
