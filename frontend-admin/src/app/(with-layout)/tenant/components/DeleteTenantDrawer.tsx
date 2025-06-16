"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ConfirmDeleteDrawer } from "@/components/Shared/ConfirmDeleteDrawer"

interface DeleteTenantDrawerProps {
    tenantName?: string
    isLoading: boolean
    onConfirm: () => void
}

export function DeleteTenantDrawer({ tenantName, isLoading, onConfirm }: DeleteTenantDrawerProps) {
    return (
        <ConfirmDeleteDrawer
            trigger={<Button variant="destructive" disabled={isLoading}>Eliminar</Button>}
            resourceName={tenantName}
            isLoading={isLoading}
            onConfirm={onConfirm}
        />
    )
}
