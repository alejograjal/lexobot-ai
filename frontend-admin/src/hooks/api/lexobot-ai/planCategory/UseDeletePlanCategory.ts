import { ErrorDetail } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UseDeletePlanCategoryProps {
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

export const UseDeletePlanCategory = ({
    onSuccess,
    onError,
    onSettled
}: UseDeletePlanCategoryProps) => {
    const path = '/api/v1/plan-categories/{category_id}';
    const method = 'delete';

    const deletePlanCategory = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const deletePlanCategoryMutation = useMutation({
        mutationKey: ['DeletePlanCategory'],
        mutationFn: async (planCategoryId: number) => {
            await deletePlanCategory(castRequestBody({ category_id: planCategoryId }, path, method))
            return undefined;
        },
        onSuccess: async (data: undefined, variables: number) => {
            await queryClient.invalidateQueries({
                queryKey: ['GetPlanCategories']
            })
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

    return deletePlanCategoryMutation;
}