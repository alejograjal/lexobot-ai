import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { TenantUserResponse } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetTenantUsers = (tenantId: string | undefined): UseQueryResult<TenantUserResponse[], ApiError> => {
    const path = '/api/v1/tenants/{tenant_id}/users';
    const method = 'get';

    const getTenantsUsers = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetTenantsUsers", tenantId],
        queryFn: async () => {
            const { data } = await getTenantsUsers(castRequestBody({ tenant_id: Number(tenantId) }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(tenantId),
        staleTime: 0,
    })
}