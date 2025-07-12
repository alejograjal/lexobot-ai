"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { Page } from "@/components/Shared/Page"
import { formatErrorMessage } from "@/lib/utils"
import { UseSnackbar } from "@/stores/UseSnackbar"
import { DeleteTenantUser } from "./DeleteTenantUser"
import { PageHeader } from "@/components/Shared/PageHeader"
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks"
import { User } from "@/app/(with-layout)/access/user/components/UserSchema"
import { UserForm } from "@/app/(with-layout)/access/user/components/UserForm"
import { UsePutTenantUser } from "@/hooks/api/lexobot-ai/tenant/UsePutTenantUser"
import { UseGetTenantById } from "@/hooks/api/lexobot-ai/tenant/UseGetTenantById"
import { CircularLoadingProgress } from "@/components/Shared/CircularLoadingProgress"
import { UseGetTenantUserById } from "@/hooks/api/lexobot-ai/tenant/UseGetTenantUserById"

export default function UpdateTenantUserPage() {
    const router = useRouter()
    const params = useParams()
    const setSnackbarMessage = UseSnackbar((state) => state.setMessage)

    const tenantIdRaw = params?.id
    const tenantUserIdRaw = params?.tenantUserId

    useEffect(() => {
        if (!tenantIdRaw || isNaN(Number(tenantIdRaw)) || !tenantUserIdRaw || isNaN(Number(tenantUserIdRaw))) {
            router.replace('/tenant')
        }
    }, [tenantIdRaw, tenantUserIdRaw, router])

    const tenantId = tenantIdRaw && !isNaN(Number(tenantIdRaw)) ? String(tenantIdRaw) : undefined
    const tenantUserId = tenantUserIdRaw && !isNaN(Number(tenantUserIdRaw)) ? String(tenantUserIdRaw) : undefined

    const [loading, setLoading] = useState(false)
    const closeLoading = () => setLoading(false)

    const { data: tenant, isLoading: isLoadingTenant, isError: isErrorTenant, error: errorTenant } = UseGetTenantById(tenantId)
    const { data: tenantUser, isLoading: isLoadingTenantUser, isError: isErrorTenantUser, error: errorTenantUser } = UseGetTenantUserById(tenantId, tenantUserId)

    const { mutate: putTenantUser } = UsePutTenantUser({
        tenantId: Number(tenantId),
        tenantUserId: Number(tenantUserId),
        ...UseMutationCallbacks('Usuario actualizado correctamente', `/tenant/${tenantId}/user`, closeLoading)
    })

    useEffect(() => {
        if (isErrorTenant) {
            const { error } = errorTenant.data
            setSnackbarMessage(formatErrorMessage(error), 'error')
            router.replace('/tenant')
        }

        if (isErrorTenantUser) {
            const { error } = errorTenantUser.data
            setSnackbarMessage(formatErrorMessage(error), 'error')
            router.replace(`/tenant/${tenantId}/user`)
        }
    }, [isErrorTenant, isErrorTenantUser, errorTenant, errorTenantUser, tenantId, router, setSnackbarMessage])

    const handleSubmit = async (data: User) => {
        setLoading(true)
        await putTenantUser({ assign: tenantUser?.assign!, user: data })
    }

    return (
        <Page
            header={
                <PageHeader
                    title={`Editar usuario ${tenantUser?.user.full_name}, del tenant ${tenant?.name}`}
                    subtitle="Actualice los campos que desee"
                    actionButton={<DeleteTenantUser tenantId={Number(tenantId)} tenantUserId={Number(tenantUserId)} userId={tenantUser?.user.id!} userName={tenantUser?.user.full_name} />}
                />
            }

        >
            {isLoadingTenant || isLoadingTenantUser ? (
                <CircularLoadingProgress />
            ) : (
                <UserForm
                    defaultValues={tenantUser?.user ?? undefined}
                    onSubmit={handleSubmit}
                    onloading={loading}
                    cancelPath={`/tenant/${tenantId}/user`}
                    disableRole
                />
            )}

        </Page>
    )
}
