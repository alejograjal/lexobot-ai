import { ErrorDetail } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UseDeleteUserProps {
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

export const UseDeleteUser = ({
    onSuccess,
    onError,
    onSettled
}: UseDeleteUserProps) => {
    const path = '/api/v1/users/{user_id}';
    const method = 'delete';

    const deleteUser = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const deleteUserMutation = useMutation({
        mutationKey: ['DeleteUser'],
        mutationFn: async (userId: number) => {
            await deleteUser(castRequestBody({ user_id: userId }, path, method))
            return undefined;
        },
        onSuccess: async (data: undefined, variables: number) => {
            await queryClient.invalidateQueries({
                queryKey: ['GetUsers']
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

    return deleteUserMutation;
}