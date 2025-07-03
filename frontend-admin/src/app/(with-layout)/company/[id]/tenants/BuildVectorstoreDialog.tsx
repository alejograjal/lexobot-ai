"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ButtonLoading } from "@/components/Button/ButtonLoading"
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks"
import { UsePostCompanyTenantBuildVectorStore } from "@/hooks/api/lexobot-ai/companyTenant/UsePostCompanyTenantBuildVectorStore"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface BuildVectorstoreDialogProps {
    assignmentId: number
}

export function BuildVectorstoreDialog({ assignmentId }: BuildVectorstoreDialogProps) {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const closeLoading = () => {
        setLoading(false)
        setOpen(false)
    }
    const { mutate: postCompanyTenantBuildVectorStore } = UsePostCompanyTenantBuildVectorStore(UseMutationCallbacks('Modelo construido correctamente', undefined, closeLoading))

    const handleConfirm = () => {
        setLoading(true)
        postCompanyTenantBuildVectorStore(assignmentId)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm">Construir modelo</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Construir modelo?</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro que desea construir el modelo de lectura para el tenant?
                        Esta acción podría tardar algunos segundos.
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
    )
}
