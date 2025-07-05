"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { Page } from "@/components/Shared/Page"
import { formatErrorMessage } from "@/lib/utils"
import { UseSnackbar } from "@/stores/UseSnackbar"
import { DeleteCompanyUser } from "./DeleteCompanyUser"
import { PageHeader } from "@/components/Shared/PageHeader"
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks"
import { User } from "@/app/(with-layout)/access/user/components/UserSchema"
import { UserForm } from "@/app/(with-layout)/access/user/components/UserForm"
import { CircularLoadingProgress } from "@/components/Shared/CircularLoadingProgress"
import { UseGetCompanyById } from "@/hooks/api/lexobot-ai/company/UseGetCompanyById"
import { UsePutCompanyUser } from "@/hooks/api/lexobot-ai/company/UsePutCompanyUser"
import { UseGetCompanyUserById } from "@/hooks/api/lexobot-ai/company/UseGetCompanyUserById"

export default function UpdateCompanyUserPage() {
    const router = useRouter()
    const params = useParams()
    const setSnackbarMessage = UseSnackbar((state) => state.setMessage)

    const companyIdRaw = params?.id
    const companyUserIdRaw = params?.companyUserId

    useEffect(() => {
        if (!companyIdRaw || isNaN(Number(companyIdRaw)) || !companyUserIdRaw || isNaN(Number(companyUserIdRaw))) {
            router.replace('/company')
        }
    }, [companyIdRaw, companyUserIdRaw, router])

    const companyId = companyIdRaw && !isNaN(Number(companyIdRaw)) ? String(companyIdRaw) : undefined
    const companyUserId = companyUserIdRaw && !isNaN(Number(companyUserIdRaw)) ? String(companyUserIdRaw) : undefined

    const [loading, setLoading] = useState(false)
    const closeLoading = () => setLoading(false)

    const { data: company, isLoading: isLoadingCompany, isError: isErrorCompany, error: errorCompany } = UseGetCompanyById(companyId)
    const { data: companyUser, isLoading: isLoadingCompanyUser, isError: isErrorCompanyUser, error: errorCompanyUser } = UseGetCompanyUserById(companyId, companyUserId)

    const { mutate: putCompanyUser } = UsePutCompanyUser({
        companyId: Number(companyId),
        companyUserId: Number(companyUserId),
        ...UseMutationCallbacks('Usuario actualizado correctamente', `/company/${companyId}/user`, closeLoading)
    })

    useEffect(() => {
        if (isErrorCompany) {
            const { error } = errorCompany.data
            setSnackbarMessage(formatErrorMessage(error), 'error')
            router.replace('/company')
        }

        if (isErrorCompanyUser) {
            const { error } = errorCompanyUser.data
            setSnackbarMessage(formatErrorMessage(error), 'error')
            router.replace(`/company/${companyId}/user`)
        }
    }, [isErrorCompany, isErrorCompanyUser, errorCompany, errorCompanyUser, companyId, router, setSnackbarMessage])

    const handleSubmit = (data: User) => {
        setLoading(true)
        putCompanyUser({ assign: companyUser?.assign!, user: data })
    }

    return (
        <Page
            header={
                <PageHeader
                    title={`Editar usuario ${companyUser?.user.full_name}, de la compañía ${company?.name}`}
                    subtitle="Actualice los campos que desee"
                    actionButton={<DeleteCompanyUser companyId={Number(companyId)} companyUserId={Number(companyUserId)} userId={companyUser?.user.id!} userName={companyUser?.user.full_name} />}
                />
            }

        >
            {isLoadingCompany || isLoadingCompanyUser ? (
                <CircularLoadingProgress />
            ) : (
                <UserForm
                    defaultValues={companyUser?.user ?? undefined}
                    onSubmit={handleSubmit}
                    onloading={loading}
                    cancelPath={`/company/${companyId}/user`}
                    disableRole
                />
            )}

        </Page>
    )
}
