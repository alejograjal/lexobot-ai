"use client"

import { ColumnDef } from "@tanstack/react-table"
import { TenantResponse } from "@/types/lexobot-ai"
import { SortableColumnHeader } from "@/components/Shared/SortableColumnHeader.tsx"
import ActionsDropDown from "./ActionsDropDown"

export const columns: ColumnDef<TenantResponse>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => <SortableColumnHeader column={column} title="Id" />,
    },
    {
        accessorKey: "name",
        header: ({ column }) => <SortableColumnHeader column={column} title="Nombre" />,
    },
    {
        accessorKey: "external_id",
        header: ({ column }) => <SortableColumnHeader column={column} title="Identificador" />,
    },
    {
        accessorKey: "contact_name",
        header: ({ column }) => <SortableColumnHeader column={column} title="Contacto" />,
    },
    {
        accessorKey: "contact_email",
        header: ({ column }) => <SortableColumnHeader column={column} title="Email" />,
    },
    {
        accessorKey: "client_count",
        header: ({ column }) => <SortableColumnHeader column={column} title="Cantidad de asociados" />,
        cell: ({ row }) => {
            return (
                <div className="text-right">
                    {row.getValue("client_count")}
                </div>
            )
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
            <div onClick={(e) => e.stopPropagation()}>
                <ActionsDropDown tenantId={String(row.original.id)} />
            </div>
        ),
    }
]