"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ButtonLoading } from "../Button/ButtonLoading"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"

interface ConfirmDeleteDrawerProps {
    trigger: React.ReactNode
    resourceName?: string
    onConfirm?: () => void
    description?: string
    isLoading?: boolean
}

export function ConfirmDeleteDrawer({
    trigger,
    resourceName = "este recurso",
    onConfirm,
    description = "Esta acción no se puede deshacer.",
    isLoading = false,
}: ConfirmDeleteDrawerProps) {
    return (
        <Drawer>
            <DrawerTrigger asChild onClick={(e) => { (e.currentTarget as HTMLElement).blur(); }}>
                {trigger}
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-lg">
                    <DrawerHeader>
                        <DrawerTitle>Eliminación del registro</DrawerTitle>
                        <DrawerDescription>
                            ¿Está seguro que desea eliminar <strong>{resourceName}</strong>?
                            <br />
                            {description}
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <ButtonLoading variant="destructive" loading={isLoading} onClick={() => { if (!isLoading) onConfirm?.() }}>
                            Si, eliminar
                        </ButtonLoading>
                        <DrawerClose asChild>
                            <Button variant="outline" disabled={isLoading}>
                                Cancelar
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
