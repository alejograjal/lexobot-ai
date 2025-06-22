"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CompanyTenantResponse } from "@/types/lexobot-ai"
import { BuildVectorstoreDialog } from "./BuildVectorstoreDialog"
import { SortableColumnHeader } from "@/components/Shared/SortableColumnHeader.tsx"

export const columns: ColumnDef<CompanyTenantResponse>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => <SortableColumnHeader column={column} title="Id" />,
    },
    {
        accessorKey: "tenant.name",
        header: ({ column }) => <SortableColumnHeader column={column} title="Tenant" />,
    },
    {
        id: "actions",
        enableHiding: false,
        size: 150,
        cell: ({ row }) => (
            <div onClick={(e) => e.stopPropagation()}>
                <BuildVectorstoreDialog assignmentId={row.original.id} />
            </div>
        ),
    }
]