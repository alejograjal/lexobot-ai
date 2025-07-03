import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { TenantUserResponse } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetTenantUserById = (tenantId: string | undefined, tenantUserId: string | undefined): UseQueryResult<TenantUserResponse, ApiError> => {
    const path = '/api/v1/tenants/{tenant_id}/users/{tenant_user_id}';
    const method = 'get';

    const getTenantUser = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetTenantUser", tenantId, tenantUserId],
        queryFn: async () => {
            const { data } = await getTenantUser(castRequestBody({ tenant_id: Number(tenantId), tenant_user_id: Number(tenantUserId) }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(tenantId) && isPresent(tenantUserId),
        staleTime: 0,
    })
}