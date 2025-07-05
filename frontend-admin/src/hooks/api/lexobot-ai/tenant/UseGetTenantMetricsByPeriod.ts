import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { MetricsByPeriod, PeriodType } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetTenantMetricsByPeriod = (tenantId: number | undefined | null, period: PeriodType | undefined | null): UseQueryResult<MetricsByPeriod[], ApiError> => {
    const path = '/api/v1/tenants/{tenant_id}/metrics/by-period/{period}';
    const method = 'get';

    const getTenantMetricsOverall = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetTenantMetricsByPeriod", tenantId, period],
        queryFn: async () => {
            const { data } = await getTenantMetricsOverall(castRequestBody({ tenant_id: Number(tenantId), period }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(tenantId) && isPresent(period),
        staleTime: 0,
    })
}