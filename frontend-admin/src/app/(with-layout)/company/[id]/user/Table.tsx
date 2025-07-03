"use client"

import { columns } from "./TableColumns"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/ui/data-table"
import { UseGetCompanyUsers } from "@/hooks/api/lexobot-ai/company/UseGetCompanyUsers"

export default function CompanyUsersTable({ companyId }: { companyId: string | undefined }) {
    const router = useRouter()
    const { data, isLoading, isError } = UseGetCompanyUsers(companyId)

    return (
        <div className="container mx-auto py-2">
            <DataTable columns={columns} data={data ?? []} loading={isLoading} error={isError} onRowClick={(row) => router.push(`/company/${companyId}/user/${row.id}`)} />
        </div>
    )
}