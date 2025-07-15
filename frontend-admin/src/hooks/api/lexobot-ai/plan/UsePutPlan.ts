import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorDetail, PlanResponse, PlanUpdate } from "@/types/lexobot-ai";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePutPlanProps {
    planId: number
    onSuccess?: (
        data: PlanResponse,
        variables: PlanUpdate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: PlanUpdate
    ) => void,
    onSettled?: (
        data: PlanResponse | undefined,
        error: ErrorDetail | null,
        variables: PlanUpdate
    ) => void
}

export const UsePutPlan = ({
    planId,
    onSuccess,
    onError,
    onSettled
}: UsePutPlanProps) => {
    const path = '/api/v1/plans/{plan_id}';
    const method = 'patch';

    const putPlan = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const updatePlanMutation = useMutation({
        mutationKey: ['PutPlan'],
        mutationFn: async (plan: PlanUpdate) => {
            const requestBody = castRequestBody({ plan_id: planId, ...plan }, path, method) as NonNullable<Parameters<typeof putPlan>[0]>
            const { data } = await putPlan(requestBody);
            return data;
        },
        onSuccess: async (data: PlanResponse, variables: PlanUpdate) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['GetPlan', planId.toString()],
                    exact: true
                }),
                queryClient.invalidateQueries({
                    queryKey: ['GetPlans'],
                    exact: false
                })
            ]);
            onSuccess?.(data, variables)
        },
        onError: (errorAPI: ApiError, _) => {
            const errorDetail = (errorAPI?.data as any)?.error;
            onError?.(errorDetail as ErrorDetail, _);
        },
        onSettled: (data, errorAPI, variables) => {
            const errorDetail = typeof errorAPI?.data === 'object' && 'error' in errorAPI.data
                ? (errorAPI.data as any).error as ErrorDetail
                : null;

            onSettled?.(data, errorDetail, variables);
        }
    })

    return updatePlanMutation;
}