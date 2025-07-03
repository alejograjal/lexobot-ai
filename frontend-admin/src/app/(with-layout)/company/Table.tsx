"use client"

import { columns } from "./TableColumns";
import { useRouter } from 'next/navigation'
import { Roles } from "@/types/lexobot-ai";
import { useAuth } from "@/context/AuthContext";
import { DataTable } from "@/components/ui/data-table";
import { UseGetCompanies } from "@/hooks/api/lexobot-ai/company/UseGetCompanies";

export default function CompanyTable() {
    const router = useRouter()
    const { userProfile } = useAuth()
    const { data, isError, isLoading } = UseGetCompanies()

    const isAdmin = userProfile?.role.name as Roles === 'Administrator'

    return (
        <div className="container mx-auto py-2">
            <DataTable columns={columns} data={data ?? []} loading={isLoading} error={isError} onRowClick={(row) => isAdmin && router.push(`/company/${row.id}`)} />
        </div>
    )
}