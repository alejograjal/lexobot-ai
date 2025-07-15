import { ApiError } from "openapi-typescript-fetch";
import { ErrorDetail, TenantUserBulk, TenantUserResponse } from "@/types/lexobot-ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePostBulkTenantUsersProps {
    tenantId: number
    onSuccess?: (
        data: TenantUserResponse[],
        variables: TenantUserBulk
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: TenantUserBulk
    ) => void,
    onSettled?: (
        data: TenantUserResponse[] | undefined,
        error: ErrorDetail | null,
        variables: TenantUserBulk
    ) => void
}

export const UsePostBulkTenantUsers = ({
    tenantId,
    onSuccess,
    onError,
    onSettled
}: UsePostBulkTenantUsersProps) => {
    const path = '/api/v1/tenants/{tenant_id}/users/bulk';
    const method = 'post';

    const postBulkTenantUsers = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const postBulkTenantUsersMutation = useMutation({
        mutationKey: ['PostBulkTenantUsers', tenantId],
        mutationFn: async (tenantUsers: TenantUserBulk) => {
            const body = castRequestBody({ tenant_id: tenantId, ...tenantUsers }, path, method) as Parameters<typeof postBulkTenantUsers>[0]
            const { data } = await postBulkTenantUsers(body);
            return data;
        },
        onSuccess: async (data: TenantUserResponse[], variables: TenantUserBulk) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['GetTenantsUsers', String(tenantId)],
                    exact: true
                }),
                queryClient.invalidateQueries({
                    queryKey: ['GetTenantUsersAvailableToAssign', String(tenantId)],
                    exact: true
                })
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

    return postBulkTenantUsersMutation;
}