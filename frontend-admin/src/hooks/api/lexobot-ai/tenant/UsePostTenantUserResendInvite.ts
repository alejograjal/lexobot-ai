import { ErrorDetail } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePostTenantUserResendInviteProps {
    tenantId: number,
    tenantUserId: number
    onSuccess?: (
        data: boolean,
        variables?: null
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables?: null
    ) => void,
    onSettled?: (
        data: boolean | undefined,
        errorAPI: ErrorDetail | null,
        variables?: null
    ) => void
}

export const UsePostTenantUserResendInvite = ({
    tenantId,
    tenantUserId,
    onSuccess,
    onError,
    onSettled
}: UsePostTenantUserResendInviteProps) => {
    const path = '/api/v1/tenants/{tenant_id}/users/{tenant_user_id}/resend-invite';
    const method = 'post';

    const PostTenantUserResendInvite = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const createTenantUserMutation = useMutation({
        mutationKey: ['PostTenantUserResendInvite', tenantId, tenantUserId],
        mutationFn: async () => {
            const requestBody = castRequestBody({ tenant_id: tenantId, tenant_user_id: tenantUserId }, path, method) as NonNullable<Parameters<typeof PostTenantUserResendInvite>[0]>
            const { data } = await PostTenantUserResendInvite(requestBody)
            return data;
        },
        onSuccess: async (data: boolean, variables: null) => {
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