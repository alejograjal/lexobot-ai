import { ErrorDetail } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useMutation } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePostCompanyTenantBuildVectorStoreProps {
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
        errorAPI: ErrorDetail | null,
        variables: number
    ) => void
}

export const UsePostCompanyTenantBuildVectorStore = ({
    onSuccess,
    onError,
    onSettled
}: UsePostCompanyTenantBuildVectorStoreProps) => {
    const path = '/api/v1/company-tenant-assignments/{assignment_id}/build-vectorstore';
    const method = 'post';

    const postCompanyTenantBuildVectorStore = UseTypedApiClientLA({ path, method })

    const createCompanyTenantBuildVectorStoreMutation = useMutation({
        mutationKey: ['PostCompanyTenant'],
        mutationFn: async (assignmentId: number) => {
            const requestBody = castRequestBody({ assignment_id: assignmentId }, path, method) as NonNullable<Parameters<typeof postCompanyTenantBuildVectorStore>[0]>
            await postCompanyTenantBuildVectorStore(requestBody)
            return undefined;
        },
        onSuccess: async (data: undefined, variables: number) => {
            onSuccess?.(data, variables)
        },
        onError: (errorAPI: ApiError, _) => {
            const errorDetail = (errorAPI?.data as any)?.error;
            onError?.(errorDetail as ErrorDetail, _);
        },
        onSettled: (data, errorAPI, variables) => {
            const errorDetail = typeof errorAPI?.data === 'object' && 'error' in errorAPI.data
                ? (errorAPI.data as any).error as ErrorDetail
                : null;

            onSettled?.(data, errorDetail, variables);
        }
    })

    return createCompanyTenantBuildVectorStoreMutation;
}