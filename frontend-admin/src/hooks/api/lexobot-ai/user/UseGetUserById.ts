import { isPresent } from "@/lib/utils";
import { UserResponse } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetUserById = (userId: string | undefined): UseQueryResult<UserResponse, ApiError> => {
    const path = '/api/v1/users/{user_id}';
    const method = 'get';

    const getUser = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetUser", userId],
        queryFn: async () => {
            const { data } = await getUser(castRequestBody({ user_id: Number(userId) }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(userId),
        staleTime: 0,
    })
}