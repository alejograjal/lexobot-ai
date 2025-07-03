"use client"

import React, { useState } from "react";
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks";
import { UseDeleteCompanyUser } from "@/hooks/api/lexobot-ai/company/UseDeleteCompanyUser";
import { DeleteUserDrawer } from "@/app/(with-layout)/access/user/components/DeleteUserDrawer";

interface DeleteCompanyUserProps {
    companyId: number;
    companyUserId: number;
    userId: number;
    userName?: string;
}

export function DeleteCompanyUser({ companyId, companyUserId, userId, userName }: DeleteCompanyUserProps) {
    const [isLoading, setIsLoading] = useState(false);
    const closeLoading = () => setIsLoading(false);

    const { mutate: deleteCompanyUser } = UseDeleteCompanyUser({ companyId, ...UseMutationCallbacks("Usuario eliminado correctamente", `/company/${companyId}/user`, closeLoading) });

    const handleConfirmDelete = () => {
        setIsLoading(true);
        deleteCompanyUser(companyUserId);
    };

    return (
        <DeleteUserDrawer
            userName={`el usuario ${userName}, id N° ${userId}`}
            isLoading={isLoading}
            onConfirm={handleConfirmDelete}
        />
    );
}
