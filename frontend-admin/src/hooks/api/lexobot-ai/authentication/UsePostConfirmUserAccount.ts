import { useMutation } from "@tanstack/react-query";
import { ApiError } from "openapi-typescript-fetch";
import { ErrorDetail, UserAccountConfirmation } from "@/types/lexobot-ai";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePostConfirmUserAccountProps {
    token: string
    onSuccess?: (
        data: boolean,
        variables: UserAccountConfirmation
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: UserAccountConfirmation
    ) => void,
    onSettled?: (
        data: boolean | undefined,
        errorAPI: ErrorDetail | null,
        variables: UserAccountConfirmation
    ) => void
}

export const UsePostConfirmUserAccount = ({
    token,
    onSuccess,
    onError,
    onSettled
}: UsePostConfirmUserAccountProps) => {
    const path = '/api/v1/auth/user/confirm/{token}';
    const method = 'post';

    const postConfirmUserAccount = UseTypedApiClientLA({ path, method, disableAuth: true })

    const createTenantMutation = useMutation({
        mutationKey: ['PostConfirmUserAccount'],
        mutationFn: async (userAccountConfirmation: UserAccountConfirmation) => {
            const requestBody = castRequestBody({ token: token, ...userAccountConfirmation }, path, method) as NonNullable<Parameters<typeof postConfirmUserAccount>[0]>
            const { data } = await postConfirmUserAccount(requestBody)
            return data;
        },
        onSuccess: async (data: boolean, variables: UserAccountConfirmation) => {
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