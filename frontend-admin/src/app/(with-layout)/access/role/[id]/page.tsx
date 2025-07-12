"use client"

import type { InferType } from "yup"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { Page } from "@/components/Shared/Page"
import { formatErrorMessage } from "@/lib/utils"
import { RoleForm } from "../components/RoleForm"
import { UseSnackbar } from "@/stores/UseSnackbar"
import { Role } from "../components/RoleSchema"
import { PageHeader } from "@/components/Shared/PageHeader"
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks"
import { UsePutRole } from "@/hooks/api/lexobot-ai/role/UsePutRole"
import { UseGetRoleById } from "@/hooks/api/lexobot-ai/role/UseGetRoleById"
import { CircularLoadingProgress } from "@/components/Shared/CircularLoadingProgress"

export default function UpdateRolePage() {
    const router = useRouter()
    const params = useParams()
    const setSnackbarMessage = UseSnackbar((state) => state.setMessage)

    const roleIdRaw = params?.id

    useEffect(() => {
        if (!roleIdRaw || isNaN(Number(roleIdRaw))) {
            router.replace('/access/role')
        }
    }, [roleIdRaw, router])

    const roleId = roleIdRaw && !isNaN(Number(roleIdRaw)) ? String(roleIdRaw) : undefined

    const [loading, setLoading] = useState(false)
    const closeLoading = () => setLoading(false)

    const { data, isLoading, isError, error: errorAPI } = UseGetRoleById(roleId)

    const { mutate: putRole } = UsePutRole({
        roleId: Number(roleId),
        ...UseMutationCallbacks('Rol actualizado correctamente', '/access/role', closeLoading)
    })

    useEffect(() => {
        if (isError) {
            const { error } = errorAPI.data
            setSnackbarMessage(formatErrorMessage(error), 'error')
            router.replace('/access/role')
        }
    }, [isError, errorAPI, router, setSnackbarMessage])

    const handleSubmit = async (data: Role) => {
        setLoading(true)
        await putRole({ ...data })
    }

    return (
        <Page
            header={
                <PageHeader
                    title={`Editar rol ${data?.name}`}
                    subtitle="Actualice los campos que desee"
                />
            }

        >
            {isLoading ? (
                <CircularLoadingProgress />
            ) : (
                <RoleForm
                    defaultValues={data ?? undefined}
                    onSubmit={handleSubmit}
                    onloading={loading}
                />
            )}

        </Page>
    )
}
