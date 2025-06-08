"use client"

import { columns } from "./TableColumns";
import { DataTable } from "@/components/ui/data-table";
import { UseGetRoles } from "@/hooks/api/lexobot-ai/role/UseGetRoles";

export default function CompanyTable() {
    const { data, isError, isLoading } = UseGetRoles()

    return (
        <div className="container mx-auto py-2">
            <DataTable columns={columns} data={data ?? []} loading={isLoading} error={isError} />
        </div>
    )
}