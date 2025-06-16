"use client"

import React, { useState } from "react";
import { DeletePlanDrawer } from "../components/DeletePlanDrawer";
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks";
import { UseDeletePlan } from "@/hooks/api/lexobot-ai/plan/UseDeletePlan";

interface DeletePlanProps {
    planId: number;
    planName?: string;
}

export function DeletePlan({ planId, planName }: DeletePlanProps) {
    const [isLoading, setIsLoading] = useState(false);
    const closeLoading = () => setIsLoading(false);

    const { mutate: deleteCompany } = UseDeletePlan(UseMutationCallbacks("Plan eliminado correctamente", "/configuration/plan", closeLoading));

    const handleConfirmDelete = () => {
        setIsLoading(true);
        deleteCompany(planId);
    };

    return (
        <DeletePlanDrawer
            planName={`el plan ${planName}, id N° ${planId}`}
            isLoading={isLoading}
            onConfirm={handleConfirmDelete}
        />
    );
}
