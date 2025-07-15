import { ApiError } from "openapi-typescript-fetch";
import { ErrorDetail, ChangePassword } from "@/types/lexobot-ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePostAccountChangePasswordProps {
    onSuccess?: (
        data: boolean,
        variables: ChangePassword
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: ChangePassword
    ) => void,
    onSettled?: (
        data: boolean | undefined,
        errorAPI: ErrorDetail | null,
        variables: ChangePassword
    ) => void
}

export const UsePostAccountChangePassword = ({
    onSuccess,
    onError,
    onSettled
}: UsePostAccountChangePasswordProps) => {
    const path = '/api/v1/accounts/change-password';
    const method = 'post';

    const postAccountChangePassword = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const accountChangePasswordMutation = useMutation({
        mutationKey: ['PostCompany'],
        mutationFn: async (changePassword: ChangePassword) => {
            const requestBody = castRequestBody(changePassword, path, method) as NonNullable<Parameters<typeof postAccountChangePassword>[0]>
            const { data } = await postAccountChangePassword(requestBody)
            return data;
        },
        onSuccess: async (data: boolean, variables: ChangePassword) => {
            await queryClient.invalidateQueries({
                queryKey: ['GetProfile']
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

    return accountChangePasswordMutation;
}