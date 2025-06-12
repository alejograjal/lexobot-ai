import { ApiError } from "openapi-typescript-fetch";
import { TenantResponse } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetTenants = (): UseQueryResult<TenantResponse[], ApiError> => {
    const path = '/api/v1/tenants';
    const method = 'get';

    const getTenants = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetTenants"],
        queryFn: async () => {
            const { data } = await getTenants(castRequestBody({}, path, method));
            return data
        },
        retry: false,
        staleTime: 0,
    })
}