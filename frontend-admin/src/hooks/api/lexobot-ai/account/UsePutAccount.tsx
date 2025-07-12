import { ApiError } from "openapi-typescript-fetch";
import { useMutation } from "@tanstack/react-query";
import { ErrorDetail, UserResponse, UserUpdate } from "@/types/lexobot-ai";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePutAccountProps {
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

export const UsePutAccount = ({
    onSuccess,
    onError,
    onSettled
}: UsePutAccountProps) => {
    const path = '/api/v1/accounts';
    const method = 'patch';

    const putAccount = UseTypedApiClientLA({ path, method })

    const updateAccountMutation = useMutation({
        mutationKey: ['PutAccount'],
        mutationFn: async (account: UserUpdate) => {
            const requestBody = castRequestBody(account, path, method) as NonNullable<Parameters<typeof putAccount>[0]>
            const { data } = await putAccount(requestBody);
            return data;
        },
        onSuccess: async (data: UserResponse, variables: UserUpdate) => {
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

    return updateAccountMutation;
}