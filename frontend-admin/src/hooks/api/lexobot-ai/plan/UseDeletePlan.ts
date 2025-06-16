import { ErrorDetail } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UseDeletePlanProps {
    onSuccess?: (
        data: undefined,
        variables: number
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: number
    ) => void,
    onSettled?: (
        data: undefined,
        error: ErrorDetail | null,
        variables: number
    ) => void
}

export const UseDeletePlan = ({
    onSuccess,
    onError,
    onSettled
}: UseDeletePlanProps) => {
    const path = '/api/v1/plans/{plan_id}';
    const method = 'delete';

    const deletePlan = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const deletePlanMutation = useMutation({
        mutationKey: ['DeletePlan'],
        mutationFn: async (planId: number) => {
            await deletePlan(castRequestBody({ plan_id: planId }, path, method))
            return undefined;
        },
        onSuccess: async (data: undefined, variables: number) => {
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
            onSettled?.(data, error as ErrorDetail, variables)
        }
    })

    return deletePlanMutation;
}