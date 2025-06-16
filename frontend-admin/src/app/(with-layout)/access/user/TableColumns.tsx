"use client"

import { ColumnDef } from "@tanstack/react-table"
import { UserResponse } from "@/types/lexobot-ai"
import { SortableColumnHeader } from "@/components/Shared/SortableColumnHeader.tsx"
import { applyPhoneMask } from "@/lib/utils"

export const columns: ColumnDef<UserResponse>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => <SortableColumnHeader column={column} title="Id" />,
    },
    {
        accessorKey: "first_name",
        header: ({ column }) => <SortableColumnHeader column={column} title="Nombre" />,
    },
    {
        accessorKey: "last_name",
        header: ({ column }) => <SortableColumnHeader column={column} title="Apellidos" />,
    },
    {
        accessorKey: "email",
        header: ({ column }) => <SortableColumnHeader column={column} title="Correo electrónico" />,
    },
    {
        accessorKey: "phone_number",
        header: ({ column }) => <SortableColumnHeader column={column} title="Teléfono" />,
        cell: ({ row }) => {
            return <div className="font-medium">{applyPhoneMask(row.getValue("phone_number"))}</div>
        }
    },
    {
        accessorKey: "username",
        header: ({ column }) => <SortableColumnHeader column={column} title="Nombre de usuario" />,
    },
]