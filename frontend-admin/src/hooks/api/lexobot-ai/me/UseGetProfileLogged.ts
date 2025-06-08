import { UserProfile } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientBS } from "@/hooks/UseTypedApiClientLA";

export const UseGetProfileLogged = (isAuthenticated: boolean): UseQueryResult<UserProfile | null, ApiError> => {
    const path = '/api/v1/me';
    const method = 'get';

    const GetProfile = UseTypedApiClientBS({ path, method })

    return useQuery({
        queryKey: ["GetProfile"],
        queryFn: async () => {
            const { data } = await GetProfile(castRequestBody({}, path, method));
            return data
        },
        retry: false,
        enabled: isAuthenticated,
        staleTime: 0,
    })
}