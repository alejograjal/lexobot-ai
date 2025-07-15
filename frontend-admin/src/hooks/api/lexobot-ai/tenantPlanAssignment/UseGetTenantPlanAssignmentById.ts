import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { TenantPlanAssignmentResponse } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetTenantPlanAssignmentById = (tenantId: string | undefined, assignmentId: string | undefined): UseQueryResult<TenantPlanAssignmentResponse, ApiError> => {
    const path = '/api/v1/tenants/{tenant_id}/plans/{assignment_id}';
    const method = 'get';

    const getTenantPlanAssignment = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetTenantPlanAssignment", tenantId, assignmentId],
        queryFn: async () => {
            const { data } = await getTenantPlanAssignment(castRequestBody({ tenant_id: Number(tenantId), assignment_id: Number(assignmentId) }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(tenantId) && isPresent(assignmentId),
        staleTime: 0,
    })
}