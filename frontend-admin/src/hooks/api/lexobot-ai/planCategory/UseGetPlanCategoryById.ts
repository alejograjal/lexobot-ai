import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { PlanCategoryResponse } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetPlanCategoryById = (planCategoryId: string | undefined): UseQueryResult<PlanCategoryResponse, ApiError> => {
    const path = '/api/v1/plan-categories/{category_id}';
    const method = 'get';

    const getPlanCategory = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetPlanCategory", planCategoryId],
        queryFn: async () => {
            const { data } = await getPlanCategory(castRequestBody({ category_id: Number(planCategoryId) }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(planCategoryId),
        staleTime: 0,
    })
}