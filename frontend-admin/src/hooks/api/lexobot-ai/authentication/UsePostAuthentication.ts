import { useMutation } from "@tanstack/react-query"
import { ApiError } from "openapi-typescript-fetch"
import { castRequestBody, UseTypedApiClientBS } from "@hooks/UseTypedApiClientLA"
import { TokenResponse, LoginRequest, ErrorDetail } from "@/types/lexobot-ai"

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

    const postAuthentication = UseTypedApiClientBS({ path, method })

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
            const { error } = errorAPI.data
            onError?.(error as ErrorDetail, _)
        }
    })
}