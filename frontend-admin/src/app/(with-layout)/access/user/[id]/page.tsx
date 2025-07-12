"use client"

import { DeleteUser } from "./DeleteUser"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { Page } from "@/components/Shared/Page"
import { User } from "../components/UserSchema"
import { formatErrorMessage } from "@/lib/utils"
import { UseSnackbar } from "@/stores/UseSnackbar"
import { PageHeader } from "@/components/Shared/PageHeader"
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks"
import { UsePutUser } from "@/hooks/api/lexobot-ai/user/UsePutUser"
import { UseGetUserById } from "@/hooks/api/lexobot-ai/user/UseGetUserById"
import { UserForm } from "@/app/(with-layout)/access/user/components/UserForm"
import { CircularLoadingProgress } from "@/components/Shared/CircularLoadingProgress"

export default function UpdateUserPage() {
    const router = useRouter()
    const params = useParams()
    const setSnackbarMessage = UseSnackbar((state) => state.setMessage)

    const userIdRaw = params?.id

    useEffect(() => {
        if (!userIdRaw || isNaN(Number(userIdRaw))) {
            router.replace('/access/user')
        }
    }, [userIdRaw, router])

    const userId = userIdRaw && !isNaN(Number(userIdRaw)) ? String(userIdRaw) : undefined

    const [loading, setLoading] = useState(false)
    const closeLoading = () => setLoading(false)

    const { data, isLoading, isError, error: errorAPI } = UseGetUserById(userId)

    const { mutate: putUser } = UsePutUser({
        userId: Number(userId),
        ...UseMutationCallbacks('Usuario actualizado correctamente', '/access/user', closeLoading)
    })

    useEffect(() => {
        if (isError) {
            const { error } = errorAPI.data
            setSnackbarMessage(formatErrorMessage(error), 'error')
            router.replace('/access/user')
        }
    }, [isError, errorAPI, router, setSnackbarMessage])

    const handleSubmit = async (data: User) => {
        setLoading(true)
        await putUser({ ...data })
    }

    return (
        <Page
            header={
                <PageHeader
                    title={`Editar usuario ${data?.first_name} ${data?.last_name}`}
                    subtitle="Actualice los campos que desee"
                    actionButton={<DeleteUser userId={Number(userId)} userName={`${data?.first_name} ${data?.last_name}`} />}
                />
            }

        >
            {isLoading ? (
                <CircularLoadingProgress />
            ) : (
                <UserForm
                    defaultValues={data ?? undefined}
                    onSubmit={handleSubmit}
                    onloading={loading}
                />
            )}

        </Page>
    )
}
