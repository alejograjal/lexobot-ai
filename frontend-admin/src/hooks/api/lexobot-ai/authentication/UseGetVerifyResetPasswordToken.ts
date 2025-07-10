import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetVerifyResetPasswordToken = (resetPasswordToken: string | undefined | null): UseQueryResult<boolean, ApiError> => {
    const path = '/api/v1/auth/user/validate-token';
    const method = 'get';

    const getCompany = UseTypedApiClientLA({ path, method, disableAuth: true })

    return useQuery({
        queryKey: ["CheckResetPasswordToken", resetPasswordToken],
        queryFn: async () => {
            const { data } = await getCompany(castRequestBody({ reset_password_token: resetPasswordToken }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(resetPasswordToken),
        staleTime: 0,
    })
}