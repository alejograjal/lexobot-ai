import { ApiError } from "openapi-typescript-fetch";
import { MetricsResponse } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetTenantMetrics = (tenantId: string | undefined | null, startDate: string | undefined, endDate: string | undefined, enabled = false): UseQueryResult<MetricsResponse, ApiError> => {
    const path = '/api/v1/tenants/{tenant_id}/metrics';
    const method = 'get';

    const getTenant = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetTenantMetrics", tenantId, startDate, endDate],
        queryFn: async () => {
            const { data } = await getTenant(castRequestBody({ tenant_id: Number(tenantId), start_date: startDate, end_date: endDate }, path, method));
            return data
        },
        retry: false,
        enabled: enabled,
        staleTime: 0,
    })
}