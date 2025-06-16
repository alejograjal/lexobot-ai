"use client"

import React, { useState } from "react";
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks";
import { DeleteTenantDrawer } from "../components/DeleteTenantDrawer";
import { UseDeleteTenant } from "@/hooks/api/lexobot-ai/tenant/UseDeleteTenant";

interface DeleteTenantProps {
    tenantId: number;
    tenantName?: string;
}

export function DeleteTenant({ tenantId, tenantName }: DeleteTenantProps) {
    const [isLoading, setIsLoading] = useState(false);
    const closeLoading = () => setIsLoading(false);

    const { mutate: deleteTenant } = UseDeleteTenant(UseMutationCallbacks("Tenant eliminado correctamente", "/tenant", closeLoading));

    const handleConfirmDelete = () => {
        setIsLoading(true);
        deleteTenant(tenantId);
    };

    return (
        <DeleteTenantDrawer
            tenantName={`el tenant ${tenantName}, id N° ${tenantId}`}
            isLoading={isLoading}
            onConfirm={handleConfirmDelete}
        />
    );
}
