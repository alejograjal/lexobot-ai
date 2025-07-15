"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { Page } from "@/components/Shared/Page"
import { formatErrorMessage } from "@/lib/utils"
import { DeleteDocument } from "./DeleteDocument"
import { UseSnackbar } from "@/stores/UseSnackbar"
import { PageHeader } from "@/components/Shared/PageHeader"
import { TenantDocumentResponse } from "@/types/lexobot-ai"
import { TenantDocumentForm } from "../components/TenantDocumentForm"
import { UseGetTenantById } from "@/hooks/api/lexobot-ai/tenant/UseGetTenantById"
import { CircularLoadingProgress } from "@/components/Shared/CircularLoadingProgress"
import { UseGetTenantDocumentById } from "@/hooks/api/lexobot-ai/tenantDocument/UseGetTenantDocumentById"

const mapTenantDocument = (document: TenantDocumentResponse) => {
    return {
        document_name: document.document_name,
        effective_date: document.effective_date ? new Date(document.effective_date) : undefined,
    }
}

export default function UpdateDocument() {
    const router = useRouter()
    const params = useParams()
    const setSnackbarMessage = UseSnackbar((state) => state.setMessage)

    const tenantIdRaw = params?.id
    const documentIdRaw = params?.documentId

    useEffect(() => {
        if (!tenantIdRaw || isNaN(Number(tenantIdRaw)) || !documentIdRaw || isNaN(Number(documentIdRaw))) {
            router.replace('/tenant')
        }
    }, [tenantIdRaw, router, documentIdRaw])

    const tenantId = tenantIdRaw && !isNaN(Number(tenantIdRaw)) ? String(tenantIdRaw) : undefined
    const documentId = documentIdRaw && !isNaN(Number(documentIdRaw)) ? String(documentIdRaw) : undefined

    const { data: tenant, isLoading: isLoadingTenant, isError: isErrorTenant, error: errorAPITenant } = UseGetTenantById(tenantId)
    const { data: document, isLoading: isLoadingDocument, isError: isErrorDocument, error: errorAPIDocument } = UseGetTenantDocumentById(tenantId, documentId)

    useEffect(() => {
        if (isErrorTenant) {
            const { error } = errorAPITenant.data
            setSnackbarMessage(formatErrorMessage(error), 'error')
            router.replace('/tenant')
        }
        if (isErrorDocument) {
            const { error } = errorAPIDocument.data
            setSnackbarMessage(formatErrorMessage(error), 'error')
            router.replace(`/tenant/${tenantId}/document`)
        }
    }, [isErrorTenant, errorAPITenant, router, setSnackbarMessage, isErrorDocument, errorAPIDocument, tenantId])

    return (
        <Page
            header={
                <PageHeader
                    title={`Documento ${document?.document_name!} del tenant: ${tenant?.name}`}
                    subtitle="Modificación de documento no disponible"
                    actionButton={<DeleteDocument tenantId={Number(tenantId)} documentId={Number(documentId)} documentName={document?.document_name!} />}
                />
            }

        >
            {isLoadingTenant || isLoadingDocument ? (
                <CircularLoadingProgress />
            ) : (
                <TenantDocumentForm
                    tenantId={Number(tenantId)}
                    defaultValues={mapTenantDocument(document!) ?? undefined}
                    onSubmit={() => { }}
                    onloading={false}
                    onEdit={true}
                />
            )}

        </Page>
    )
}
