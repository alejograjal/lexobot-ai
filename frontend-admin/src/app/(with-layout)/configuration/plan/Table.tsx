"use client"

import { columns } from "./TableColumns";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { UseGetPlans } from "@/hooks/api/lexobot-ai/plan/UseGetPlans";

export default function PlanTable() {
    const router = useRouter()
    const { data, isError, isLoading } = UseGetPlans()

    return (
        <div className="container mx-auto py-2">
            <DataTable columns={columns} data={data ?? []} loading={isLoading} error={isError} onRowClick={(row) => router.push(`/configuration/plan/${row.id}`)} />
        </div>
    )
}