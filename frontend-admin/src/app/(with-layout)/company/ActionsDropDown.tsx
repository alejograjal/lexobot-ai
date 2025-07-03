"use client"

import Link from "next/link"
import { Roles } from "@/types/lexobot-ai"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ActionsDropDown({ companyId }: { companyId: string }) {
    const { userProfile } = useAuth()

    const isAdmin = userProfile?.role.name as Roles === 'Administrator'

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`/company/${companyId}/tenants`}>
                        Tenants asignados
                    </Link>
                </DropdownMenuItem>
                {isAdmin && (
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={`/company/${companyId}/user`}>
                            Usuarios asignados
                        </Link>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}