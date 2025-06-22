"use client"

import React, { useState } from "react";
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks";
import { DeleteDocumentDrawer } from "../components/DeleteDocumentDrawer";
import { UseDeleteTenantDocument } from "@/hooks/api/lexobot-ai/tenantDocument/UseDeleteTenantDocument";

interface DeleteDocumentProps {
    tenantId: number;
    documentId: number;
    documentName?: string;
}

export function DeleteDocument({ tenantId, documentId, documentName }: DeleteDocumentProps) {
    const [isLoading, setIsLoading] = useState(false);
    const closeLoading = () => setIsLoading(false);

    const { mutate: deleteDocument } = UseDeleteTenantDocument({ tenantId, ...UseMutationCallbacks("Documento eliminado correctamente", `/tenant/${tenantId}/document`, closeLoading) });

    const handleConfirmDelete = () => {
        setIsLoading(true);
        deleteDocument(documentId);
    };

    return (
        <DeleteDocumentDrawer
            documentName={`${documentName}, id N° ${documentId}`}
            isLoading={isLoading}
            onConfirm={handleConfirmDelete}
        />
    );
}
