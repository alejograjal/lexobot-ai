import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorDetail, TenantResponse, TenantCreate } from "@/types/lexobot-ai";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePostTenantProps {
    onSuccess?: (
        data: TenantResponse,
        variables: TenantCreate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: TenantCreate
    ) => void,
    onSettled?: (
        data: TenantResponse | undefined,
        errorAPI: ErrorDetail | null,
        variables: TenantCreate
    ) => void
}

export const UsePostTenant = ({
    onSuccess,
    onError,
    onSettled
}: UsePostTenantProps) => {
    const path = '/api/v1/tenants';
    const method = 'post';

    const postTenant = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const createTenantMutation = useMutation({
        mutationKey: ['PostTenant'],
        mutationFn: async (tenant: TenantCreate) => {
            const requestBody = castRequestBody(tenant, path, method) as NonNullable<Parameters<typeof postTenant>[0]>
            const { data } = await postTenant(requestBody)
            return data;
        },
        onSuccess: async (data: TenantResponse, variables: TenantCreate) => {
            await queryClient.invalidateQueries({
                queryKey: ['GetTenants']
            })
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

    return createTenantMutation;
}