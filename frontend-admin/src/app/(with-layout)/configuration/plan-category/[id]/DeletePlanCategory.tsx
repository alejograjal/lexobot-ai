"use client"

import React, { useState } from "react";
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks";
import { DeletePlanCategoryDrawer } from "../components/DeletePlanCategoryDrawer";
import { UseDeletePlanCategory } from "@/hooks/api/lexobot-ai/planCategory/UseDeletePlanCategory";

interface DeletePlanCategoryProps {
    planCategoryId: number;
    planCategoryName?: string;
}

export function DeletePlanCategory({ planCategoryId, planCategoryName }: DeletePlanCategoryProps) {
    const [isLoading, setIsLoading] = useState(false);
    const closeLoading = () => setIsLoading(false);

    const { mutate: deleteCompany } = UseDeletePlanCategory(UseMutationCallbacks("Categoría de plan eliminada correctamente", "/configuration/plan-category", closeLoading));

    const handleConfirmDelete = async () => {
        setIsLoading(true);
        await deleteCompany(planCategoryId);
    };

    return (
        <DeletePlanCategoryDrawer
            planCategoryName={`el usuario ${planCategoryName}, id N° ${planCategoryId}`}
            isLoading={isLoading}
            onConfirm={handleConfirmDelete}
        />
    );
}
