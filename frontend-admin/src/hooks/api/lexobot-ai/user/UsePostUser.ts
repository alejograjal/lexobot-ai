import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorDetail, UserResponse, UserCreate } from "@/types/lexobot-ai";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePostUserProps {
    onSuccess?: (
        data: UserResponse,
        variables: UserCreate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: UserCreate
    ) => void,
    onSettled?: (
        data: UserResponse | undefined,
        errorAPI: ErrorDetail | null,
        variables: UserCreate
    ) => void
}

export const UsePostUser = ({
    onSuccess,
    onError,
    onSettled
}: UsePostUserProps) => {
    const path = '/api/v1/users';
    const method = 'post';

    const postUser = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const createUserMutation = useMutation({
        mutationKey: ['PostUser'],
        mutationFn: async (company: UserCreate) => {
            const requestBody = castRequestBody(company, path, method) as NonNullable<Parameters<typeof postUser>[0]>
            const { data } = await postUser(requestBody)
            return data;
        },
        onSuccess: async (data: UserResponse, variables: UserCreate) => {
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
            onSettled?.(data, error, variables)
        }
    })

    return createUserMutation;
}