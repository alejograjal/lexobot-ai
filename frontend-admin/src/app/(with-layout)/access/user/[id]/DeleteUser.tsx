"use client"

import React, { useState } from "react";
import { DeleteUserDrawer } from "../components/DeleteUserDrawer";
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks";
import { UseDeleteUser } from "@/hooks/api/lexobot-ai/user/UseDeleteUser";

interface DeleteUserProps {
    userId: number;
    userName?: string;
}

export function DeleteUser({ userId, userName }: DeleteUserProps) {
    const [isLoading, setIsLoading] = useState(false);
    const closeLoading = () => setIsLoading(false);

    const { mutate: deleteCompany } = UseDeleteUser(UseMutationCallbacks("Usuario eliminado correctamente", "/access/user", closeLoading));

    const handleConfirmDelete = async () => {
        setIsLoading(true);
        await deleteCompany(userId);
    };

    return (
        <DeleteUserDrawer
            userName={`el usuario ${userName}, id N° ${userId}`}
            isLoading={isLoading}
            onConfirm={handleConfirmDelete}
        />
    );
}
