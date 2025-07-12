"use client"


import CompanyAccess from "./access/page"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { DeleteCompany } from "./DeleteCompany"
import { Page } from "@/components/Shared/Page"
import { formatErrorMessage } from "@/lib/utils"
import { UseSnackbar } from "@/stores/UseSnackbar"
import { Company } from "../components/CompanySchema"
import { useQueryClient } from "@tanstack/react-query"
import { PageHeader } from "@/components/Shared/PageHeader"
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks"
import { UsePutCompany } from "@/hooks/api/lexobot-ai/company/UsePutCompany"
import { CompanyForm } from "@/app/(with-layout)/company/components/CompanyForm"
import { UseGetCompanyById } from "@/hooks/api/lexobot-ai/company/UseGetCompanyById"
import { CircularLoadingProgress } from "@/components/Shared/CircularLoadingProgress"

export default function UpdateCompanyPage() {
    const router = useRouter()
    const params = useParams()
    const queryClient = useQueryClient();
    const setSnackbarMessage = UseSnackbar((state) => state.setMessage)
    const companyIdRaw = params?.id

    useEffect(() => {
        if (!companyIdRaw || isNaN(Number(companyIdRaw))) {
            router.replace('/company')
        }
    }, [companyIdRaw, router])

    const companyId = companyIdRaw && !isNaN(Number(companyIdRaw)) ? String(companyIdRaw) : undefined

    useEffect(() => {
        if (companyId) {
            queryClient.invalidateQueries({ queryKey: ["GetCompanyAccesses", companyId] })
        }
    }, [companyId, queryClient])


    const [loading, setLoading] = useState(false)
    const closeLoading = () => setLoading(false)

    const { data, isLoading, isError, error: errorAPI } = UseGetCompanyById(companyId)

    const { mutate: putCompany } = UsePutCompany({
        companyId: Number(companyId),
        ...UseMutationCallbacks('Compañia actualizada correctamente', '/company', closeLoading)
    })

    useEffect(() => {
        if (isError) {
            const { error } = errorAPI.data
            setSnackbarMessage(formatErrorMessage(error), 'error')
            router.replace('/company')
        }
    }, [isError, errorAPI, router, setSnackbarMessage])

    const handleSubmit = async (data: Company) => {
        setLoading(true)
        await putCompany({ ...data })
    }

    return (
        <Page
            header={
                <PageHeader
                    title={`Editar compañia ${data?.name}`}
                    subtitle="Actualice los campos que desee"
                    actionButton={<DeleteCompany companyId={Number(companyId)} companyName={data?.name!} />}
                />
            }

        >
            {isLoading ? (
                <CircularLoadingProgress />
            ) : (
                <>
                    <CompanyForm defaultValues={data ?? undefined} onSubmit={handleSubmit} onloading={loading} />
                    <CompanyAccess />
                </>

            )}

        </Page>
    )
}
