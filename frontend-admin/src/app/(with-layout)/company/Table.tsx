"use client"

import { columns } from "./TableColumns";
import { useRouter } from 'next/navigation'
import { DataTable } from "@/components/ui/data-table";
import { UseGetCompanies } from "@/hooks/api/lexobot-ai/company/UseGetCompanies";

export default function CompanyTable() {
    const router = useRouter()
    const { data, isError, isLoading } = UseGetCompanies()

    return (
        <div className="container mx-auto py-2">
            <DataTable columns={columns} data={data ?? []} loading={isLoading} error={isError} onRowClick={(row) => router.push(`/company/${row.id}`)} />
        </div>
    )
}