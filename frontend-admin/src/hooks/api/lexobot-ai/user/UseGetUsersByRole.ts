import { UserResponse } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";
import { isPresent } from "@/lib/utils";

export const UseGetUsersByRole = (roleId?: number | undefined): UseQueryResult<UserResponse[], ApiError> => {
    const path = '/api/v1/users';
    const method = 'get';

    const getUsers = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetUsers"],
        queryFn: async () => {
            let body = roleId ? castRequestBody({ role_id: Number(roleId) }, path, method) : castRequestBody({}, path, method);
            const { data } = await getUsers(body);
            return data
        },
        retry: false,
        enabled: isPresent(roleId),
        staleTime: 0,
    })
}