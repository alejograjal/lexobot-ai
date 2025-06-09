import { RoleResponse } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetRoles = (): UseQueryResult<RoleResponse[], ApiError> => {
    const path = '/api/v1/roles';
    const method = 'get';

    const getRoles = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetRoles"],
        queryFn: async () => {
            const { data } = await getRoles(castRequestBody({}, path, method));
            return data
        },
        retry: false,
        staleTime: 0,
    })
}