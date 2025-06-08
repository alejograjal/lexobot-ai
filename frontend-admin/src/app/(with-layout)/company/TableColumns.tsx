"use client"

import { applyPhoneMask } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { CompanyResponse } from "@/types/lexobot-ai"
import { SortableColumnHeader } from "@/components/Shared/SortableColumnHeader.tsx"

export const columns: ColumnDef<CompanyResponse>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => <SortableColumnHeader column={column} title="Id" />,
    },
    {
        accessorKey: "name",
        header: ({ column }) => <SortableColumnHeader column={column} title="Nombre" />,
    },
    {
        accessorKey: "legal_id",
        header: ({ column }) => <SortableColumnHeader column={column} title="Cédula" />,
    },
    {
        accessorKey: "email",
        header: ({ column }) => <SortableColumnHeader column={column} title="Correo Electrónico" />,
    },
    {
        accessorKey: "phone",
        header: ({ column }) => <SortableColumnHeader column={column} title="Teléfono" />,
        cell: ({ row }) => {
            return <div className="font-medium">{applyPhoneMask(row.getValue("phone"))}</div>
        }
    },
    {
        accessorKey: "managed_tenants_count",
        header: ({ column }) => <SortableColumnHeader column={column} title="Tenants gestionados" />,
        cell: ({ row }) => {
            return (
                <div className="text-right">
                    {row.getValue("managed_tenants_count")}
                </div>
            )
        },
    },
]