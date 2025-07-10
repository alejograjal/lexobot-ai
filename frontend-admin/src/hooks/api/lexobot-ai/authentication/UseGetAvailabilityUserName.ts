import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetAvailabilityUserName = (username: string | undefined): UseQueryResult<boolean, ApiError> => {
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
        enabled: isPresent(username) && username.length > 6,
        staleTime: 0,
    })
}