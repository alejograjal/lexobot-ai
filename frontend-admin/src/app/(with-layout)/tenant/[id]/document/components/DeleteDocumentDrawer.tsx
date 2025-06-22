"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ConfirmDeleteDrawer } from "@/components/Shared/ConfirmDeleteDrawer"

interface DeleteDocumentDrawerProps {
    documentName?: string
    isLoading: boolean
    onConfirm: () => void
}

export function DeleteDocumentDrawer({ documentName, isLoading, onConfirm }: DeleteDocumentDrawerProps) {
    return (
        <ConfirmDeleteDrawer
            trigger={<Button variant="destructive" disabled={isLoading}>Eliminar</Button>}
            resourceName={documentName}
            isLoading={isLoading}
            onConfirm={onConfirm}
        />
    )
}
