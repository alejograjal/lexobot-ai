import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";
import { ErrorDetail, PlanCategoryResponse, PlanCategoryUpdate } from "@/types/lexobot-ai";

interface UsePutPlanCategoryProps {
    planCategoryId: number
    onSuccess?: (
        data: PlanCategoryResponse,
        variables: PlanCategoryUpdate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: PlanCategoryUpdate
    ) => void,
    onSettled?: (
        data: PlanCategoryResponse | undefined,
        error: ErrorDetail | null,
        variables: PlanCategoryUpdate
    ) => void
}

export const UsePutPlanCategory = ({
    planCategoryId,
    onSuccess,
    onError,
    onSettled
}: UsePutPlanCategoryProps) => {
    const path = '/api/v1/plan-categories/{category_id}';
    const method = 'patch';

    const putPlanCategory = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const updatePlanCategoryMutation = useMutation({
        mutationKey: ['PutPlanCategory'],
        mutationFn: async (planCategory: PlanCategoryUpdate) => {
            const requestBody = castRequestBody({ category_id: planCategoryId, ...planCategory }, path, method) as NonNullable<Parameters<typeof putPlanCategory>[0]>
            const { data } = await putPlanCategory(requestBody);
            return data;
        },
        onSuccess: async (data: PlanCategoryResponse, variables: PlanCategoryUpdate) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['GetPlanCategory', planCategoryId.toString()],
                    exact: true
                }),
                queryClient.invalidateQueries({
                    queryKey: ['GetPlanCategories'],
                    exact: false
                })
            ]);
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

    return updatePlanCategoryMutation;
}