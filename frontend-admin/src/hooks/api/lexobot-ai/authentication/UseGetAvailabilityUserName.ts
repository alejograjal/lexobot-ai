import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetAvailabilityUserName = (username: string | undefined, options?: { enabled?: boolean }): UseQueryResult<boolean, ApiError> => {
    const path = '/api/v1/auth/user/check-availability';
    const method = 'get';

    const getCompany = UseTypedApiClientLA({ path, method, disableAuth: true })

    return useQuery({
        queryKey: ["CheckUserName", username],
        queryFn: async () => {
            const { data } = await getCompany(castRequestBody({ user_name: username }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(username) && options?.enabled,
        staleTime: 0,
    })
}