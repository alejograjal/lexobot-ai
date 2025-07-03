"use client"

import React, { useState } from "react";
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks";
import { UseDeleteCompanyUser } from "@/hooks/api/lexobot-ai/company/UseDeleteCompanyUser";
import { DeleteUserDrawer } from "@/app/(with-layout)/access/user/components/DeleteUserDrawer";
import { UseDeleteTenantUser } from "@/hooks/api/lexobot-ai/tenant/UseDeleteTenantUser";

interface DeleteTenantUserProps {
    tenantId: number;
    tenantUserId: number;
    userId: number;
    userName?: string;
}

export function DeleteTenantUser({ tenantId, tenantUserId, userId, userName }: DeleteTenantUserProps) {
    const [isLoading, setIsLoading] = useState(false);
    const closeLoading = () => setIsLoading(false);

    const { mutate: deleteTenantUser } = UseDeleteTenantUser({ tenantId, ...UseMutationCallbacks("Usuario eliminado correctamente", `/tenant/${tenantId}/user`, closeLoading) });

    const handleConfirmDelete = () => {
        setIsLoading(true);
        deleteTenantUser(tenantUserId);
    };

    return (
        <DeleteUserDrawer
            userName={`el usuario ${userName}, id N° ${userId}`}
            isLoading={isLoading}
            onConfirm={handleConfirmDelete}
        />
    );
}
