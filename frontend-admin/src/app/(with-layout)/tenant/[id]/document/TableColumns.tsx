"use client"

import { formatDate } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { TenantDocumentResponse } from "@/types/lexobot-ai"
import { SortableColumnHeader } from "@/components/Shared/SortableColumnHeader.tsx"

export const columns: ColumnDef<TenantDocumentResponse>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => <SortableColumnHeader column={column} title="Id" />,
    },
    {
        accessorKey: "document_name",
        header: ({ column }) => <SortableColumnHeader column={column} title="Nombre" />,
    },
    {
        accessorKey: "effective_date",
        header: ({ column }) => <SortableColumnHeader column={column} title="Fecha efectiva" />,
        cell: ({ row }) => {
            return (
                <div className="text-right">
                    {formatDate(row.getValue("effective_date"))}
                </div>
            )
        },
    },
]