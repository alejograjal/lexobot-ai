import { ApiError } from "openapi-typescript-fetch";
import { useApiClient } from "@/hooks/useApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBodyMultipart } from "@/hooks/UseTypedApiClientLA";
import { ErrorDetail, TenantDocumentResponse, TenantDocumentCreateWithFile } from "@/types/lexobot-ai";

type ErrorResponse = {
    error: ErrorDetail;
};

interface UsePostTenantDocumentProps {
    tenantId: number
    onSuccess?: (
        data: TenantDocumentResponse,
        variables: TenantDocumentCreateWithFile
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: TenantDocumentCreateWithFile
    ) => void,
    onSettled?: (
        data: TenantDocumentResponse | undefined,
        errorAPI: ErrorDetail | null,
        variables: TenantDocumentCreateWithFile
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

    const postTenantDocument = useApiClient();
    const queryClient = useQueryClient();

    const createTenantDocumentMutation = useMutation({
        mutationKey: ['PostTenantDocument', tenantId],
        mutationFn: async (tenantDocument: TenantDocumentCreateWithFile) => {
            const formData: FormData = castRequestBodyMultipart(tenantDocument, method);

            const { data, error } = await postTenantDocument.POST(path, {
                params: {
                    path: {
                        tenant_id: tenantId
                    }
                },
                body: formData as any,
                bodySerializer: () => formData
            });

            if (error) {
                throw error as unknown as ApiError;
            }

            return data;
        },
        onSuccess: async (data: TenantDocumentResponse, variables: TenantDocumentCreateWithFile) => {
            await queryClient.invalidateQueries({
                queryKey: ['GetTenantDocuments', tenantId]
            })
            onSuccess?.(data, variables)
        },
        onError: (errorAPI: ErrorResponse, _) => {
            onError?.(errorAPI.error as ErrorDetail, _)
        },
        onSettled: (data, errorAPI, variables) => {
            const error = errorAPI?.error ?? null
            onSettled?.(data, error, variables)
        }
    })

    return createTenantDocumentMutation;
}