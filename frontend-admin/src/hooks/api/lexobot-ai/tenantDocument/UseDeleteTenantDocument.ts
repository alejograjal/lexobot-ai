import { ErrorDetail } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UseDeleteTenantDocumentProps {
    tenantId: number
    onSuccess?: (
        data: undefined,
        variables: number
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: number
    ) => void,
    onSettled?: (
        data: undefined,
        error: ErrorDetail | null,
        variables: number
    ) => void
}

export const UseDeleteTenantDocument = ({
    tenantId,
    onSuccess,
    onError,
    onSettled
}: UseDeleteTenantDocumentProps) => {
    const path = '/api/v1/tenants/{tenant_id}/documents/{document_id}';
    const method = 'delete';

    const deleteTenantDocument = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const deleteTenantDocumentMutation = useMutation({
        mutationKey: ['DeleteTenantDocument'],
        mutationFn: async (tenantDocumentId: number) => {
            await deleteTenantDocument(castRequestBody({ tenant_id: tenantId, document_id: tenantDocumentId }, path, method))
            return undefined;
        },
        onSuccess: async (data: undefined, variables: number) => {
            await queryClient.invalidateQueries({
                queryKey: ['GetTenantDocuments', tenantId]
            })
            onSuccess?.(data, variables)
        },
        onError: (errorAPI: ApiError, _) => {
            const { error } = errorAPI.data
            onError?.(error as ErrorDetail, _)
        },
        onSettled: (data, errorAPI, variables) => {
            const { error } = errorAPI?.data ?? null
            onSettled?.(data, error as ErrorDetail, variables)
        }
    })

    return deleteTenantDocumentMutation;
}