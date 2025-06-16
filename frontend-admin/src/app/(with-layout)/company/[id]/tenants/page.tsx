"use client";

import { useEffect } from "react";
import CompanyTenantsTable from "./Table";
import { Page } from "@/components/Shared/Page";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/Shared/PageHeader";
import NewActionButton from "@/components/Shared/NewActionButton";
import { UseGetCompanyById } from "@/hooks/api/lexobot-ai/company/UseGetCompanyById";

export default function Tenant() {
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

    return (
        <Page
            header={
                <PageHeader
                    title={`Tenants asignados a la compañia: ${isLoading ? '...' : data?.name}`}
                    actionButton={<NewActionButton path={`/company/${companyId}/tenants/assign`} title="Gestionar tenants" />}
                />
            }
        >
            <CompanyTenantsTable />
        </Page>
    )
}