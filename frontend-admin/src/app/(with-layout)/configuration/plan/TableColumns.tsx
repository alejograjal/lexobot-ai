"use client"

import { formatCurrency } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { PlanResponse } from "@/types/lexobot-ai"
import { SortableColumnHeader } from "@/components/Shared/SortableColumnHeader.tsx"

export const columns: ColumnDef<PlanResponse>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => <SortableColumnHeader column={column} title="Id" />,
    },
    {
        accessorKey: "name",
        header: ({ column }) => <SortableColumnHeader column={column} title="Nombre" />,
    },
    {
        accessorKey: "base_price",
        header: ({ column }) => <SortableColumnHeader column={column} title="Precio base" />,
        cell: ({ row }) => (
            <div className="text-right">
                {formatCurrency(Number(row.original.base_price))}
            </div>
        ),
    },
    {
        accessorKey: "max_associates",
        header: ({ column }) => <SortableColumnHeader column={column} title="Cantidad máxima de asociados" />,
        cell: ({ row }) => (
            <div className="text-right">
                {row.original.max_associates}
            </div>
        ),
    },
    {
        accessorKey: "plan_category.name",
        header: ({ column }) => <SortableColumnHeader column={column} title="Categoría de plan" />,
        cell: ({ row }) => row.original.plan_category.name,
    }
]