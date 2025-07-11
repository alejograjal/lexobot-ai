"use client"

import { applyPhoneMask } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { ColumnDef } from "@tanstack/react-table"
import { CompanyUserResponse } from "@/types/lexobot-ai"
import { SortableColumnHeader } from "@/components/Shared/SortableColumnHeader.tsx"
import ActionsDropDown from "./ActionsDropDown"

export const columns: ColumnDef<CompanyUserResponse>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => <SortableColumnHeader column={column} title="Id" />,
    },
    {
        accessorKey: "user.full_name",
        header: ({ column }) => <SortableColumnHeader column={column} title="Usuario" />,
        cell: ({ row }) => row.original.user.full_name
    },
    {
        accessorKey: "user.email",
        header: ({ column }) => <SortableColumnHeader column={column} title="Correo" />,
        cell: ({ row }) => row.original.user.email
    },
    {
        accessorKey: "user.username",
        header: ({ column }) => <SortableColumnHeader column={column} title="Username" />,
        cell: ({ row }) => row.original.user.username
    },
    {
        accessorKey: "user.phone_number",
        header: ({ column }) => <SortableColumnHeader column={column} title="Teléfono" />,
        cell: ({ row }) => {
            return <div className="font-medium">{applyPhoneMask(row.getValue("user.phone_number"))}</div>
        }
    },
    {
        accessorKey: "assign",
        header: ({ column }) => (
            <div className="text-right text-white">
                Asignado
            </div>
        ),
        cell: ({ row }) => {
            return (
                <div className="text-right">
                    <Switch checked={row.original.assign} disabled />
                </div>
            );
        },
        enableSorting: false,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
            <div onClick={(e) => e.stopPropagation()}>
                <ActionsDropDown companyId={row.original.company_id} companyUserId={row.original.id} hasAccountCreated={row.original.user.username !== ""} />
            </div>
        ),
    }
]