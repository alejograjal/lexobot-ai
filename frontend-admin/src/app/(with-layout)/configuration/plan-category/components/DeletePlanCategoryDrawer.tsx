"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ConfirmDeleteDrawer } from "@/components/Shared/ConfirmDeleteDrawer"

interface DeletePlanCategoryDrawerProps {
    planCategoryName?: string
    isLoading: boolean
    onConfirm: () => void
}

export function DeletePlanCategoryDrawer({ planCategoryName, isLoading, onConfirm }: DeletePlanCategoryDrawerProps) {
    return (
        <ConfirmDeleteDrawer
            trigger={<Button variant="destructive" disabled={isLoading}>Eliminar</Button>}
            resourceName={planCategoryName}
            isLoading={isLoading}
            onConfirm={onConfirm}
        />
    )
}
