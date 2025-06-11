"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ConfirmDeleteDrawer } from "@/components/Shared/ConfirmDeleteDrawer"

interface DeletePlanDrawerProps {
    planName?: string
    isLoading: boolean
    onConfirm: () => void
}

export function DeletePlanDrawer({ planName, isLoading, onConfirm }: DeletePlanDrawerProps) {
    return (
        <ConfirmDeleteDrawer
            trigger={<Button variant="destructive" disabled={isLoading}>Eliminar</Button>}
            resourceName={planName}
            isLoading={isLoading}
            onConfirm={onConfirm}
        />
    )
}
