import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorDetail, TenantResponse, TenantUpdate } from "@/types/lexobot-ai";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePutTenantProps {
    tenantId: number
    onSuccess?: (
        data: TenantResponse,
        variables: TenantUpdate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: TenantUpdate
    ) => void,
    onSettled?: (
        data: TenantResponse | undefined,
        error: ErrorDetail | null,
        variables: TenantUpdate
    ) => void
}

export const UsePutTenant = ({
    tenantId,
    onSuccess,
    onError,
    onSettled
}: UsePutTenantProps) => {
    const path = '/api/v1/tenants/{tenant_id}';
    const method = 'patch';

    const putTenant = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const updateTenantMutation = useMutation({
        mutationKey: ['PutTenant'],
        mutationFn: async (tenant: TenantUpdate) => {
            const requestBody = castRequestBody({ tenant_id: tenantId, ...tenant }, path, method) as NonNullable<Parameters<typeof putTenant>[0]>
            const { data } = await putTenant(requestBody);
            return data;
        },
        onSuccess: async (data: TenantResponse, variables: TenantUpdate) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['GetTenant', tenantId.toString()],
                    exact: true
                }),
                queryClient.invalidateQueries({
                    queryKey: ['GetTenants'],
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

    return updateTenantMutation;
}