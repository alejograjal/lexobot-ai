import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";
import { ErrorDetail, TenantUserResponse, TenantUserCreate } from "@/types/lexobot-ai";

interface UsePostTenantUserProps {
    tenantId: number,
    onSuccess?: (
        data: TenantUserResponse,
        variables: TenantUserCreate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: TenantUserCreate
    ) => void,
    onSettled?: (
        data: TenantUserResponse | undefined,
        errorAPI: ErrorDetail | null,
        variables: TenantUserCreate
    ) => void
}

export const UsePostTenantUser = ({
    tenantId,
    onSuccess,
    onError,
    onSettled
}: UsePostTenantUserProps) => {
    const path = '/api/v1/tenants/{tenant_id}/users';
    const method = 'post';

    const postTenantUser = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const createTenantUserMutation = useMutation({
        mutationKey: ['PostTenantUser', tenantId],
        mutationFn: async (tenant: TenantUserCreate) => {
            const requestBody = castRequestBody({ tenant_id: tenantId, ...tenant }, path, method) as NonNullable<Parameters<typeof postTenantUser>[0]>
            const { data } = await postTenantUser(requestBody)
            return data;
        },
        onSuccess: async (data: TenantUserResponse, variables: TenantUserCreate) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['GetTenantsUsers', tenantId],
                    exact: false
                }),
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

    return createTenantUserMutation;
}