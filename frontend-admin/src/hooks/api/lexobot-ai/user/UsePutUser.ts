import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";
import { ErrorDetail, UserResponse, UserUpdate } from "@/types/lexobot-ai";

interface UsePutUserProps {
    userId: number
    onSuccess?: (
        data: UserResponse,
        variables: UserUpdate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: UserUpdate
    ) => void,
    onSettled?: (
        data: UserResponse | undefined,
        error: ErrorDetail | null,
        variables: UserUpdate
    ) => void
}

export const UsePutUser = ({
    userId,
    onSuccess,
    onError,
    onSettled
}: UsePutUserProps) => {
    const path = '/api/v1/users/{user_id}';
    const method = 'patch';

    const putUser = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const updateUserMutation = useMutation({
        mutationKey: ['PutUser'],
        mutationFn: async (user: UserUpdate) => {
            const requestBody = castRequestBody({ user_id: userId, ...user }, path, method) as NonNullable<Parameters<typeof putUser>[0]>
            const { data } = await putUser(requestBody);
            return data;
        },
        onSuccess: async (data: UserResponse, variables: UserUpdate) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['GetUser', userId.toString()],
                    exact: true
                }),
                queryClient.invalidateQueries({
                    queryKey: ['GetUsers'],
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

    return updateUserMutation;
}