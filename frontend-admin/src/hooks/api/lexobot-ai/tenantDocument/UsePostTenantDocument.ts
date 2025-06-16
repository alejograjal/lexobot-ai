import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";
import { ErrorDetail, TenantDocumentResponse, TenantDocumentCreate } from "@/types/lexobot-ai";
import { te } from "date-fns/locale";

interface UsePostTenantDocumentProps {
    tenantId: number
    onSuccess?: (
        data: TenantDocumentResponse,
        variables: TenantDocumentCreate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: TenantDocumentCreate
    ) => void,
    onSettled?: (
        data: TenantDocumentResponse | undefined,
        errorAPI: ErrorDetail | null,
        variables: TenantDocumentCreate
    ) => void
}

export const UsePostTenantDocument = ({
    tenantId,
    onSuccess,
    onError,
    onSettled
}: UsePostTenantDocumentProps) => {
    const path = '/api/v1/tenants/{tenant_id}/documents';
    const method = 'post';

    const postTenantDocument = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const createTenantDocumentMutation = useMutation({
        mutationKey: ['PostTenantDocument', tenantId],
        mutationFn: async (tenantDocument: TenantDocumentCreate) => {
            const requestBody = castRequestBody({ tenant_id: tenantId, ...tenantDocument }, path, method) as NonNullable<Parameters<typeof postTenantDocument>[0]>
            const { data } = await postTenantDocument(requestBody)
            return data;
        },
        onSuccess: async (data: TenantDocumentResponse, variables: TenantDocumentCreate) => {
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
            onSettled?.(data, error, variables)
        }
    })

    return createTenantDocumentMutation;
}