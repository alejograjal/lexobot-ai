import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { TenantDocumentCount } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetTenantDocumentCount = (tenantId: number | undefined | null): UseQueryResult<TenantDocumentCount, ApiError> => {
    const path = '/api/v1/tenants/{tenant_id}/documents/count';
    const method = 'get';

    const getTenantDocumentCount = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetTenantDocumentCount", tenantId],
        queryFn: async () => {
            const { data } = await getTenantDocumentCount(castRequestBody({ tenant_id: Number(tenantId) }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(tenantId),
        staleTime: 0,
    })
}