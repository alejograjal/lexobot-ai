import { isPresent } from "@/lib/utils";
import { PlanResponse } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetPlanById = (planId: string | undefined): UseQueryResult<PlanResponse, ApiError> => {
    const path = '/api/v1/plans/{plan_id}';
    const method = 'get';

    const getPlan = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetPlan", planId],
        queryFn: async () => {
            const { data } = await getPlan(castRequestBody({ plan_id: Number(planId) }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(planId),
        staleTime: 0,
    })
}