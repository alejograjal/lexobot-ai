import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetVerifyConfirmationToken = (confirmationToken: string | undefined | null): UseQueryResult<boolean, ApiError> => {
    const path = '/api/v1/auth/user/validate-token';
    const method = 'get';

    const getCompany = UseTypedApiClientLA({ path, method, disableAuth: true })

    return useQuery({
        queryKey: ["CheckConfirmationToken", confirmationToken],
        queryFn: async () => {
            const { data } = await getCompany(castRequestBody({ confirmation_token: confirmationToken }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(confirmationToken),
        staleTime: 0,
    })
}