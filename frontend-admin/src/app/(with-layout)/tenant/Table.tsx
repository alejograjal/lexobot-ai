"use client"

import { columns } from "./TableColumns";
import { useRouter } from 'next/navigation'
import { Roles } from "@/types/lexobot-ai";
import { useAuth } from "@/context/AuthContext";
import { DataTable } from "@/components/ui/data-table";
import { UseGetTenants } from "@/hooks/api/lexobot-ai/tenant/UseGetTenants";

export default function TenantTable() {
    const router = useRouter()
    const { userProfile } = useAuth()
    const { data, isError, isLoading } = UseGetTenants()

    const isAdmin = userProfile?.role.name as Roles === 'Administrator'

    return (
        <div className="container mx-auto py-2">
            <DataTable columns={columns} data={data ?? []} loading={isLoading} error={isError} onRowClick={(row) => isAdmin && router.push(`/tenant/${row.id}`)} />
        </div>
    )
}