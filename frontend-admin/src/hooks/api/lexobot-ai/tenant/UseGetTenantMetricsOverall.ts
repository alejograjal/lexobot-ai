import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { MetricsOverviewResponse } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetTenantMetricsOverall = (tenantId: number | undefined | null): UseQueryResult<MetricsOverviewResponse, ApiError> => {
    const path = '/api/v1/tenants/{tenant_id}/metrics/overall';
    const method = 'get';

    const getTenantMetricsOverall = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetTenantMetricsOverall", tenantId],
        queryFn: async () => {
            const { data } = await getTenantMetricsOverall(castRequestBody({ tenant_id: tenantId }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(tenantId),
        staleTime: 0,
    })
}