import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorDetail, PlanResponse, PlanCreate } from "@/types/lexobot-ai";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePostPlanProps {
    onSuccess?: (
        data: PlanResponse,
        variables: PlanCreate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: PlanCreate
    ) => void,
    onSettled?: (
        data: PlanResponse | undefined,
        errorAPI: ErrorDetail | null,
        variables: PlanCreate
    ) => void
}

export const UsePostPlan = ({
    onSuccess,
    onError,
    onSettled
}: UsePostPlanProps) => {
    const path = '/api/v1/plans';
    const method = 'post';

    const postPlan = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const createPlanMutation = useMutation({
        mutationKey: ['PostPlan'],
        mutationFn: async (plan: PlanCreate) => {
            const requestBody = castRequestBody(plan, path, method) as NonNullable<Parameters<typeof postPlan>[0]>
            const { data } = await postPlan(requestBody)
            return data;
        },
        onSuccess: async (data: PlanResponse, variables: PlanCreate) => {
            await queryClient.invalidateQueries({
                queryKey: ['GetPlans']
            })
            onSuccess?.(data, variables)
        },
        onError: (errorAPI: ApiError, _) => {
            const { error } = errorAPI.data
            onError?.(error as ErrorDetail, _)
        },
        onSettled: (data, errorAPI, variables) => {
            const { error } = errorAPI?.data ?? null
            onSettled?.(data, error, variables)
        }
    })

    return createPlanMutation;
}