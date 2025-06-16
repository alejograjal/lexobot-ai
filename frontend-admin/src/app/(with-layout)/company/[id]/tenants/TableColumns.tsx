"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CompanyTenantResponse } from "@/types/lexobot-ai"
import { SortableColumnHeader } from "@/components/Shared/SortableColumnHeader.tsx"

export const columns: ColumnDef<CompanyTenantResponse>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => <SortableColumnHeader column={column} title="Id" />,
    },
    {
        accessorKey: "tenant.name",
        header: ({ column }) => <SortableColumnHeader column={column} title="Tenant" />,
    }
]