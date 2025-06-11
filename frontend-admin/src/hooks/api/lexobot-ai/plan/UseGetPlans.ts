import { PlanResponse } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetPlans = (): UseQueryResult<PlanResponse[], ApiError> => {
    const path = '/api/v1/plans';
    const method = 'get';

    const getPlans = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetPlans"],
        queryFn: async () => {
            const { data } = await getPlans(castRequestBody({}, path, method));
            return data
        },
        retry: false,
        staleTime: 0,
    })
}