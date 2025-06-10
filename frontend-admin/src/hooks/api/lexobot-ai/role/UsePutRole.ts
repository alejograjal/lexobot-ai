import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";
import { ErrorDetail, RoleResponse, RoleUpdate } from "@/types/lexobot-ai";

interface UsePutRoleProps {
    roleId: number
    onSuccess?: (
        data: RoleResponse,
        variables: RoleUpdate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: RoleUpdate
    ) => void,
    onSettled?: (
        data: RoleResponse | undefined,
        error: ErrorDetail | null,
        variables: RoleUpdate
    ) => void
}

export const UsePutRole = ({
    roleId,
    onSuccess,
    onError,
    onSettled
}: UsePutRoleProps) => {
    const path = '/api/v1/roles/{role_id}';
    const method = 'patch';

    const putRole = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const updateRoleMutation = useMutation({
        mutationKey: ['PutRole'],
        mutationFn: async (role: RoleUpdate) => {
            const requestBody = castRequestBody({ role_id: roleId, ...role }, path, method) as NonNullable<Parameters<typeof putRole>[0]>
            const { data } = await putRole(requestBody);
            return data;
        },
        onSuccess: async (data: RoleResponse, variables: RoleUpdate) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['GetRole', roleId.toString()],
                    exact: true
                }),
                queryClient.invalidateQueries({
                    queryKey: ['GetRoles'],
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

    return updateRoleMutation;
}