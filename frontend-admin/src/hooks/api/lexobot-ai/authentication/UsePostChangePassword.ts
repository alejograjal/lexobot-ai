import { useMutation } from "@tanstack/react-query";
import { ApiError } from "openapi-typescript-fetch";
import { ErrorDetail, UserChangePassword } from "@/types/lexobot-ai";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePostChangePasswordProps {
    token: string
    onSuccess?: (
        data: boolean,
        variables: UserChangePassword
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: UserChangePassword
    ) => void,
    onSettled?: (
        data: boolean | undefined,
        errorAPI: ErrorDetail | null,
        variables: UserChangePassword
    ) => void
}

export const UsePostChangePassword = ({
    token,
    onSuccess,
    onError,
    onSettled
}: UsePostChangePasswordProps) => {
    const path = '/api/v1/auth/user/password-change/{token}';
    const method = 'post';

    const postChangePassword = UseTypedApiClientLA({ path, method, disableAuth: true })

    const createTenantMutation = useMutation({
        mutationKey: ['PostConfirmUserAccount'],
        mutationFn: async (userChangePassword: UserChangePassword) => {
            const requestBody = castRequestBody({ token: token, ...userChangePassword }, path, method) as NonNullable<Parameters<typeof postChangePassword>[0]>
            const { data } = await postChangePassword(requestBody)
            return data;
        },
        onSuccess: async (data: boolean, variables: UserChangePassword) => {
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