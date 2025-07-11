"use client"

import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonLoading } from "@/components/Button/ButtonLoading"
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks"
import { UsePostTenantUserResendInvite } from "@/hooks/api/lexobot-ai/tenant/UsePostTenantUserResendInvite"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ActionsDropDown({ tenantId, tenantUserId, hasAccountCreated = false }: { tenantId: number, tenantUserId: number, hasAccountCreated: boolean }) {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const closeLoading = () => {
        setLoading(false)
        setOpen(false)
    }

    const { mutate: resendInvite } = UsePostTenantUserResendInvite({
        tenantId,
        tenantUserId,
        ...UseMutationCallbacks('Invitación reenviada correctamente', undefined, closeLoading)
    })

    const handleConfirm = () => {
        setLoading(true)
        resendInvite(null)
    }

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
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="default" disabled={hasAccountCreated} size="sm">Reenviar invitación</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirmación de cuenta</DialogTitle>
                                <DialogDescription>
                                    ¿Está seguro que desea reenviar la invitación?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                                <ButtonLoading loading={loading} onClick={handleConfirm} className="w-full sm:w-auto">
                                    Confirmar
                                </ButtonLoading>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}