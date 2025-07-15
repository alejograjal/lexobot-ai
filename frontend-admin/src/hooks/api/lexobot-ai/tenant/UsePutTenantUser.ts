import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";
import { ErrorDetail, TenantUserResponse, TenantUserUpdate } from "@/types/lexobot-ai";

interface UsePutTenantUserProps {
    tenantId: number,
    tenantUserId: number
    onSuccess?: (
        data: TenantUserResponse,
        variables: TenantUserUpdate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: TenantUserUpdate
    ) => void,
    onSettled?: (
        data: TenantUserResponse | undefined,
        error: ErrorDetail | null,
        variables: TenantUserUpdate
    ) => void
}

export const UsePutTenantUser = ({
    tenantId,
    tenantUserId,
    onSuccess,
    onError,
    onSettled
}: UsePutTenantUserProps) => {
    const path = '/api/v1/tenants/{tenant_id}/users/{tenant_user_id}';
    const method = 'patch';

    const putTenantUser = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const updateTenantUserMutation = useMutation({
        mutationKey: ['PutCompany'],
        mutationFn: async (tenant: TenantUserUpdate) => {
            const requestBody = castRequestBody({ tenant_id: tenantId, tenant_user_id: tenantUserId, ...tenant }, path, method) as NonNullable<Parameters<typeof putTenantUser>[0]>
            const { data } = await putTenantUser(requestBody);
            return data;
        },
        onSuccess: async (data: TenantUserResponse, variables: TenantUserUpdate) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['GetTenantsUser', tenantId],
                    exact: false
                }),
            ]);
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

    return updateTenantUserMutation;
}