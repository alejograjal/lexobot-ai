"use client"

import React, { useState } from "react";
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks";
import { DeleteCompanyDrawer } from "../components/DeleteCompanyDrawer";
import { UseDeleteCompany } from "@/hooks/api/lexobot-ai/company/UseDeleteCompany";

interface DeleteCompanyProps {
    companyId: number;
    companyName?: string;
}

export function DeleteCompany({ companyId, companyName }: DeleteCompanyProps) {
    const [isLoading, setIsLoading] = useState(false);
    const closeLoading = () => setIsLoading(false);

    const { mutate: deleteCompany } = UseDeleteCompany(UseMutationCallbacks("Compañía borrada correctamente", "/company", closeLoading));

    const handleConfirmDelete = () => {
        setIsLoading(true);
        deleteCompany(companyId);
    };

    return (
        <DeleteCompanyDrawer
            companyName={`la compañia ${companyName}, id N° ${companyId}`}
            isLoading={isLoading}
            onConfirm={handleConfirmDelete}
        />
    );
}
