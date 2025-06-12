import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { TenantResponse } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetTenantById = (tenantId: string | undefined): UseQueryResult<TenantResponse, ApiError> => {
    const path = '/api/v1/tenants/{tenant_id}';
    const method = 'get';

    const getTenant = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetTenant", tenantId],
        queryFn: async () => {
            const { data } = await getTenant(castRequestBody({ tenant_id: Number(tenantId) }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(tenantId),
        staleTime: 0,
    })
}