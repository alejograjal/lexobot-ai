import { ApiError } from "openapi-typescript-fetch";
import { PlanCategoryResponse } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetPlanCategories = (): UseQueryResult<PlanCategoryResponse[], ApiError> => {
    const path = '/api/v1/plan-categories';
    const method = 'get';

    const getPlanCategories = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetPlanCategories"],
        queryFn: async () => {
            const { data } = await getPlanCategories(castRequestBody({}, path, method));
            return data
        },
        retry: false,
        staleTime: 0,
    })
}