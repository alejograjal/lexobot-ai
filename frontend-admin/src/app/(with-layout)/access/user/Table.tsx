"use client"

import { columns } from "./TableColumns";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { UseGetUsers } from "@/hooks/api/lexobot-ai/user/UseGetUsers";

export default function CompanyTable() {
    const router = useRouter()
    const { data, isError, isLoading } = UseGetUsers()

    return (
        <div className="container mx-auto py-2">
            <DataTable columns={columns} data={data ?? []} loading={isLoading} error={isError} onRowClick={(row) => router.push(`/access/user/${row.id}`)} />
        </div>
    )
}