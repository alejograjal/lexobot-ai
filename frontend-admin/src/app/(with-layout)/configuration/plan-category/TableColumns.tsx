"use client"

import { ColumnDef } from "@tanstack/react-table"
import { RoleResponse } from "@/types/lexobot-ai"
import { SortableColumnHeader } from "@/components/Shared/SortableColumnHeader.tsx"

export const columns: ColumnDef<RoleResponse>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => <SortableColumnHeader column={column} title="Id" />,
    },
    {
        accessorKey: "name",
        header: ({ column }) => <SortableColumnHeader column={column} title="Nombre" />,
    },
    {
        accessorKey: "description",
        header: ({ column }) => <SortableColumnHeader column={column} title="Descripción" />,
    }
]