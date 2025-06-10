import { isPresent } from "@/lib/utils";
import { RoleResponse } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetRoleById = (roleId: string | undefined): UseQueryResult<RoleResponse, ApiError> => {
    const path = '/api/v1/roles/{role_id}';
    const method = 'get';

    const getRole = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetRole", roleId],
        queryFn: async () => {
            const { data } = await getRole(castRequestBody({ role_id: Number(roleId) }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(roleId),
        staleTime: 0,
    })
}