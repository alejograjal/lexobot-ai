"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ConfirmDeleteDrawer } from "@/components/Shared/ConfirmDeleteDrawer"

interface DeleteUserDrawerProps {
    userName?: string
    isLoading: boolean
    onConfirm: () => void
}

export function DeleteUserDrawer({ userName, isLoading, onConfirm }: DeleteUserDrawerProps) {
    return (
        <ConfirmDeleteDrawer
            trigger={<Button variant="destructive" disabled={isLoading}>Eliminar</Button>}
            resourceName={userName}
            isLoading={isLoading}
            onConfirm={onConfirm}
        />
    )
}
