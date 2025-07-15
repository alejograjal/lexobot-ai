import { useMutation } from "@tanstack/react-query";
import { ApiError } from "openapi-typescript-fetch";
import { ErrorDetail, ResetPassword } from "@/types/lexobot-ai";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePostResetPasswordProps {
    onSuccess?: (
        data: boolean,
        variables: ResetPassword
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: ResetPassword
    ) => void,
    onSettled?: (
        data: boolean | undefined,
        errorAPI: ErrorDetail | null,
        variables: ResetPassword
    ) => void
}

export const UsePostResetPassword = ({
    onSuccess,
    onError,
    onSettled
}: UsePostResetPasswordProps) => {
    const path = '/api/v1/auth/user/password-reset';
    const method = 'post';

    const postResetPassword = UseTypedApiClientLA({ path, method, disableAuth: true })

    const createTenantMutation = useMutation({
        mutationKey: ['PostConfirmUserAccount'],
        mutationFn: async (resetPassword: ResetPassword) => {
            const requestBody = castRequestBody(resetPassword, path, method) as NonNullable<Parameters<typeof postResetPassword>[0]>
            const { data } = await postResetPassword(requestBody)
            return data;
        },
        onSuccess: async (data: boolean, variables: ResetPassword) => {
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

    return createTenantMutation;
}