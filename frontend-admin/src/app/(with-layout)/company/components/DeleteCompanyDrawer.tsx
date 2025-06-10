"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ConfirmDeleteDrawer } from "@/components/Shared/ConfirmDeleteDrawer"

interface DeleteCompanyDrawerProps {
    companyName?: string
    isLoading: boolean
    onConfirm: () => void
}

export function DeleteCompanyDrawer({ companyName, isLoading, onConfirm }: DeleteCompanyDrawerProps) {
    return (
        <ConfirmDeleteDrawer
            trigger={<Button variant="destructive" disabled={isLoading}>Eliminar</Button>}
            resourceName={companyName ?? "este recurso"}
            isLoading={isLoading}
            onConfirm={onConfirm}
        />
    )
}
