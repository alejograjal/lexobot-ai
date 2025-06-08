"use client"

import { columns } from "./TableColumns";
import { DataTable } from "@/components/ui/data-table";
import { UseGetUsers } from "@/hooks/api/lexobot-ai/user/UsetGetUsers";

export default function CompanyTable() {
    const { data, isError, isLoading } = UseGetUsers()

    return (
        <div className="container mx-auto py-2">
            <DataTable columns={columns} data={data ?? []} loading={isLoading} error={isError} />
        </div>
    )
}