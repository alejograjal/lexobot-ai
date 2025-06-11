"use client"

import { columns } from "./TableColumns";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { UseGetPlanCategories } from "@/hooks/api/lexobot-ai/planCategory/UseGetPlanCategories";

export default function PlanCategoryTable() {
    const router = useRouter()
    const { data, isError, isLoading } = UseGetPlanCategories()

    return (
        <div className="container mx-auto py-2">
            <DataTable columns={columns} data={data ?? []} loading={isLoading} error={isError} onRowClick={(row) => router.push(`/configuration/plan-category/${row.id}`)} />
        </div>
    )
}