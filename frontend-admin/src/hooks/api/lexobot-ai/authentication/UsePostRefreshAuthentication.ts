import { useMutation } from "@tanstack/react-query"
import { ApiError } from "openapi-typescript-fetch"
import { castRequestBody, UseTypedApiClientBS } from "@/hooks/UseTypedApiClientLA"
import { TokenResponse, ErrorDetail, RefreshTokenRequest } from "@/types/lexobot-ai"

interface UsePostRefreshAuthenticationProps {
    onSuccess?: (
        data: TokenResponse,
        variables: RefreshTokenRequest
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: RefreshTokenRequest
    ) => void
}

export const UsePostRefreshAuthentication = ({
    onSuccess,
    onError
}: UsePostRefreshAuthenticationProps) => {
    const path = '/api/v1/auth/refresh';
    const method = 'post';

    const postRefreshToken = UseTypedApiClientBS({ path, method })

    return useMutation({
        mutationFn: async (
            tokenRefreshModel: RefreshTokenRequest
        ) => {
            const requestBody = castRequestBody(tokenRefreshModel, path, method) as NonNullable<Parameters<typeof postRefreshToken>[0]>;
            const { data } = await postRefreshToken(requestBody);
            return data;
        },
        onSuccess,
        onError: (error: ApiError, _) => {
            onError?.(error.data as ErrorDetail, _)
        }
    })
}