import { ApiError } from "openapi-typescript-fetch";
import { ErrorDetail, TenantUserBulk } from "@/types/lexobot-ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePutBulkTenantUsersProps {
    tenantId: number
    onSuccess?: (
        data: undefined,
        variables: TenantUserBulk
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: TenantUserBulk
    ) => void,
    onSettled?: (
        data: undefined | undefined,
        error: ErrorDetail | null,
        variables: TenantUserBulk
    ) => void
}

export const UsePutBulkTenantUsers = ({
    tenantId,
    onSuccess,
    onError,
    onSettled
}: UsePutBulkTenantUsersProps) => {
    const path = '/api/v1/tenants/{tenant_id}/users/bulk-sync';
    const method = 'put';

    const putBulkTenantUser = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const putBulkTenantUsersMutation = useMutation({
        mutationKey: ['PostBulkTenantUsers'],
        mutationFn: async (tenantUsers: TenantUserBulk) => {
            const body = castRequestBody({ tenant_id: tenantId, ...tenantUsers }, path, method) as Parameters<typeof putBulkTenantUser>[0]
            await putBulkTenantUser(body);
            return undefined;
        },
        onSuccess: async (data: undefined, variables: TenantUserBulk) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['GetTenantsUsers', tenantId],
                    exact: true
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

    return putBulkTenantUsersMutation;
}