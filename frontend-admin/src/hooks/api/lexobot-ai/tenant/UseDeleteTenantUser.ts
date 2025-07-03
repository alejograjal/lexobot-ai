import { ErrorDetail } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UseDeleteTenantUserProps {
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

export const UseDeleteTenantUser = ({
    tenantId,
    onSuccess,
    onError,
    onSettled
}: UseDeleteTenantUserProps) => {
    const path = '/api/v1/tenants/{tenant_id}/users/{tenant_user_id}';
    const method = 'delete';

    const deleteTenantUser = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const deleteTenantUserMutation = useMutation({
        mutationKey: ['DeleteTenantUser'],
        mutationFn: async (companyUserId: number) => {
            await deleteTenantUser(castRequestBody({ tenant_id: tenantId, tenant_user_id: companyUserId }, path, method))
            return undefined;
        },
        onSuccess: async (data: undefined, variables: number) => {
            await queryClient.invalidateQueries({
                queryKey: ['GetTenantsUsers', tenantId]
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

    return deleteTenantUserMutation;
}