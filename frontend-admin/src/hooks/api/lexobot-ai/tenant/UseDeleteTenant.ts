import { ErrorDetail } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UseDeleteTenantProps {
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

export const UseDeleteTenant = ({
    onSuccess,
    onError,
    onSettled
}: UseDeleteTenantProps) => {
    const path = '/api/v1/tenants/{tenant_id}';
    const method = 'delete';

    const deleteTenant = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const deleteTenantMutation = useMutation({
        mutationKey: ['DeleteTenant'],
        mutationFn: async (tenantId: number) => {
            await deleteTenant(castRequestBody({ tenant_id: tenantId }, path, method))
            return undefined;
        },
        onSuccess: async (data: undefined, variables: number) => {
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

    return deleteTenantMutation;
}