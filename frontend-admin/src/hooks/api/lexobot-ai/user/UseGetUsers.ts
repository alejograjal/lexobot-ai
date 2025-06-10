import { UserResponse } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetUsers = (): UseQueryResult<UserResponse[], ApiError> => {
    const path = '/api/v1/users';
    const method = 'get';

    const getUsers = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetUsers"],
        queryFn: async () => {
            const { data } = await getUsers(castRequestBody({}, path, method));
            return data
        },
        retry: false,
        staleTime: 0,
    })
}