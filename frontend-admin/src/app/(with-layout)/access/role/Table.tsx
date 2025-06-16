"use client"

import { columns } from "./TableColumns";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { UseGetRoles } from "@/hooks/api/lexobot-ai/role/UseGetRoles";

export default function RoleTable() {
    const router = useRouter()
    const { data, isError, isLoading } = UseGetRoles()

    return (
        <div className="container mx-auto py-2">
            <DataTable columns={columns} data={data ?? []} loading={isLoading} error={isError} onRowClick={(row) => router.push(`/access/role/${row.id}`)} />
        </div>
    )
}