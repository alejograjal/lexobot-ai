"use client"

import { useEffect } from "react";
import { columns } from "./TableColumns";
import { useParams, useRouter } from 'next/navigation'
import { DataTable } from "@/components/ui/data-table";
import { UseGetCompanyTenants } from "@/hooks/api/lexobot-ai/companyTenant/UseGetCompanyTenants";

export default function CompanyTenantsTable() {
    const router = useRouter()
    const params = useParams()
    const companyIdRaw = params?.id

    useEffect(() => {
        if (!companyIdRaw || isNaN(Number(companyIdRaw))) {
            router.replace('/company')
        }
    }, [companyIdRaw, router])

    const companyId = companyIdRaw && !isNaN(Number(companyIdRaw)) ? String(companyIdRaw) : undefined

    const { data, isLoading, isError } = UseGetCompanyTenants(companyId)

    return (
        <div className="container mx-auto py-2">
            <DataTable columns={columns} data={data ?? []} loading={isLoading} error={isError} />
        </div>
    )
}