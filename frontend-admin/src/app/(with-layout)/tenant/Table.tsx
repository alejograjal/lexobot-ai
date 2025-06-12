"use client"

import { columns } from "./TableColumns";
import { useRouter } from 'next/navigation'
import { DataTable } from "@/components/ui/data-table";
import { UseGetTenants } from "@/hooks/api/lexobot-ai/tenant/UseGetTenants";

export default function TenantTable() {
    const router = useRouter()
    const { data, isError, isLoading } = UseGetTenants()

    return (
        <div className="container mx-auto py-2">
            <DataTable columns={columns} data={data ?? []} loading={isLoading} error={isError} onRowClick={(row) => router.push(`/tenant/${row.id}`)} />
        </div>
    )
}