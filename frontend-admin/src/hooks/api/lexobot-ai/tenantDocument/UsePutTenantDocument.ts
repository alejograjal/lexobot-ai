import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";
import { ErrorDetail, TenantDocumentResponse, TenantDocumentUpdate } from "@/types/lexobot-ai";

interface UsePutTenantDocumentProps {
    tenantId: number
    tenantDocumentId: number
    onSuccess?: (
        data: TenantDocumentResponse,
        variables: TenantDocumentUpdate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: TenantDocumentUpdate
    ) => void,
    onSettled?: (
        data: TenantDocumentResponse | undefined,
        error: ErrorDetail | null,
        variables: TenantDocumentUpdate
    ) => void
}

export const UsePutTenantDocument = ({
    tenantId,
    tenantDocumentId,
    onSuccess,
    onError,
    onSettled
}: UsePutTenantDocumentProps) => {
    const path = '/api/v1/tenants/{tenant_id}/documents/{document_id}';
    const method = 'patch';

    const putTenantDocument = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const updateTenantDocumentMutation = useMutation({
        mutationKey: ['PutTenantDocument', tenantId, tenantDocumentId],
        mutationFn: async (tenantDocument: TenantDocumentUpdate) => {
            const requestBody = castRequestBody({ tenant_id: tenantId, document_id: tenantDocumentId, ...tenantDocument }, path, method) as NonNullable<Parameters<typeof putTenantDocument>[0]>
            const { data } = await putTenantDocument(requestBody);
            return data;
        },
        onSuccess: async (data: TenantDocumentResponse, variables: TenantDocumentUpdate) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['GetTenantDocument', tenantId.toString(), tenantDocumentId.toString()],
                    exact: true
                }),
                queryClient.invalidateQueries({
                    queryKey: ['GetTenantDocuments', tenantId.toString()],
                    exact: false
                })
            ]);
            onSuccess?.(data, variables)
        },
        onError: (errorAPI: ApiError, _) => {
            const { error } = errorAPI.data
            onError?.(error as ErrorDetail, _)
        },
        onSettled: (data, errorAPI, variables) => {
            const { error } = errorAPI?.data ?? null
            onSettled?.(data, error, variables)
        }
    })

    return updateTenantDocumentMutation;
}