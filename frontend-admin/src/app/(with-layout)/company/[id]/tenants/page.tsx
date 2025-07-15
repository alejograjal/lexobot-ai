"use client";

import { useEffect } from "react";
import CompanyTenantsTable from "./Table";
import { Roles } from "@/types/lexobot-ai";
import { Page } from "@/components/Shared/Page";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/Shared/PageHeader";
import NewActionButton from "@/components/Shared/NewActionButton";
import { UseGetCompanyById } from "@/hooks/api/lexobot-ai/company/UseGetCompanyById";

export default function Tenant() {
    const { userProfile } = useAuth()
    const router = useRouter()
    const params = useParams()
    const companyIdRaw = params?.id

    const isAdmin = userProfile?.role.name as Roles === 'Administrator'

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
                    title={`Tenants asignados a la compañía: ${isLoading ? '...' : data?.name}`}
                    actionButton={isAdmin && <NewActionButton path={`/company/${companyId}/tenants/assign`} title="Gestionar tenants" className="sm:w-auto w-full" />}
                />
            }
        >
            <CompanyTenantsTable />
        </Page>
    )
}