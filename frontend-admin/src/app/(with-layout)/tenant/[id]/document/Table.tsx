"use client"

import { useEffect } from "react";
import { columns } from "./TableColumns";
import { useParams, useRouter } from 'next/navigation'
import { DataTable } from "@/components/ui/data-table";
import { UseGetTenantDocuments } from "@/hooks/api/lexobot-ai/tenantDocument/UseGetTenantDocuments";

export default function TenantTable() {
    const router = useRouter()
    const params = useParams()
    const tenantIdRaw = params?.id

    useEffect(() => {
        if (!tenantIdRaw || isNaN(Number(tenantIdRaw))) {
            router.replace(`/tenant/${tenantIdRaw}`)
        }
    }, [tenantIdRaw, router])

    const tenantId = tenantIdRaw && !isNaN(Number(tenantIdRaw)) ? String(tenantIdRaw) : undefined

    const { data, isLoading, isError } = UseGetTenantDocuments(tenantId)

    return (
        <div className="container mx-auto py-2">
            <DataTable columns={columns} data={data ?? []} loading={isLoading} error={isError} onRowClick={(row) => router.push(`/tenant/${row.id}`)} />
        </div>
    )
}