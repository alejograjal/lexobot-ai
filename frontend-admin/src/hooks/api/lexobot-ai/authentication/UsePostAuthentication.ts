import { useMutation } from "@tanstack/react-query"
import { ApiError } from "openapi-typescript-fetch"
import { TokenResponse, LoginRequest, ErrorDetail } from "@/types/lexobot-ai"
import { castRequestBody, UseTypedApiClientLA } from "@hooks/UseTypedApiClientLA"

interface UsePostAuthenticationProps {
    onSuccess?: (
        data: TokenResponse,
        variables: LoginRequest
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: LoginRequest
    ) => void
}

export const UsePostAuthentication = ({
    onSuccess,
    onError
}: UsePostAuthenticationProps) => {
    const path = '/api/v1/auth/login';
    const method = 'post';

    const postAuthentication = UseTypedApiClientLA({ path, method })

    return useMutation({
        mutationFn: async (
            loginUserInformation: LoginRequest
        ) => {
            const requestBody = castRequestBody(loginUserInformation, path, method) as NonNullable<Parameters<typeof postAuthentication>[0]>;
            const { data } = await postAuthentication(requestBody);
            return data;
        },
        onSuccess,
        onError: (errorAPI: ApiError, _) => {
            const errorDetail = (errorAPI?.data as any)?.error;
            onError?.(errorDetail as ErrorDetail, _);
        }
    })
}