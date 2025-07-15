import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { TenantPlanAssignmentResponse } from "@/types/lexobot-ai";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetTenantPlanAssignments = (tenantId: string | undefined): UseQueryResult<TenantPlanAssignmentResponse[], ApiError> => {
    const path = '/api/v1/tenants/{tenant_id}/plans';
    const method = 'get';

    const getTenantPlanAssignments = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetTenantPlanAssignments", tenantId],
        queryFn: async () => {
            const { data } = await getTenantPlanAssignments(castRequestBody({ tenant_id: Number(tenantId) }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(tenantId),
        staleTime: 0,
    })
}