"use client"

import { ColumnDef } from "@tanstack/react-table"
import { TenantResponse } from "@/types/lexobot-ai"
import { Checkbox } from "@/components/ui/checkbox"
import { SortableColumnHeader } from "@/components/Shared/SortableColumnHeader.tsx"

export const columns: ColumnDef<TenantResponse>[] = [
    {
        accessorKey: "id",
        header: ({ table }) => (
            <Checkbox
                className="border border-white bg-white"
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Seleccionar todos"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => <SortableColumnHeader column={column} title="Nombre" />,
    }
]