"use client"

import { columns } from "./TableColumns"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/ui/data-table"
import { UseGetTenantUsers } from "@/hooks/api/lexobot-ai/tenant/UseGetTenantUsers"

export default function TenantUsersTable({ tenantId }: { tenantId: string | undefined }) {
    const router = useRouter()
    const { data, isLoading, isError } = UseGetTenantUsers(tenantId)

    return (
        <div className="container mx-auto py-2">
            <DataTable columns={columns} data={data ?? []} loading={isLoading} error={isError} onRowClick={(row) => router.push(`/tenant/${tenantId}/user/${row.id}`)} />
        </div>
    )
}