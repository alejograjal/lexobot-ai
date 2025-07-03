"use client"

import { useEffect } from "react"
import CompanyUsersTable from "./Table"
import { Page } from "@/components/Shared/Page"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/Shared/PageHeader"
import NewActionButton from "@/components/Shared/NewActionButton"
import { UseGetCompanyById } from "@/hooks/api/lexobot-ai/company/UseGetCompanyById"

export default function CompanyUsers() {
    const router = useRouter()
    const params = useParams()
    const companyIdRaw = params?.id

    useEffect(() => {
        if (!companyIdRaw || isNaN(Number(companyIdRaw))) {
            router.replace('/company')
        }
    }, [companyIdRaw, router])

    const companyId = companyIdRaw && !isNaN(Number(companyIdRaw)) ? String(companyIdRaw) : undefined

    const { data, isLoading, isError } = UseGetCompanyById(companyId)

    useEffect(() => {
        if (isError) {
            router.replace('/company')
        }
    }, [isError, router])

    const actionButtonCreateAssign = () => {
        return (
            <div className="flex flex-col gap-1 justify-end sm:flex-row sm:w-full">
                <NewActionButton path={`/company/${companyId}/user/new`} title="Agregar" showIcon={false} className="min-w-[150px]" />
                <NewActionButton path={`/company/${companyId}/user/assign`} title="Gestionar" showIcon={false} className="min-w-[150px]" />
            </div>
        )
    }

    return (
        <Page
            header={
                <PageHeader
                    title={`Usuarios asignados a la compañia: ${isLoading ? '...' : data?.name}`}
                    actionButton={actionButtonCreateAssign()}
                />
            }
        >
            <CompanyUsersTable companyId={companyId} />
        </Page>
    )
}