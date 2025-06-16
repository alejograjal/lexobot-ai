import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";
import { ErrorDetail, PlanCategoryResponse, PlanCategoryCreate } from "@/types/lexobot-ai";

interface UsePostPlanCategoryProps {
    onSuccess?: (
        data: PlanCategoryResponse,
        variables: PlanCategoryCreate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: PlanCategoryCreate
    ) => void,
    onSettled?: (
        data: PlanCategoryResponse | undefined,
        errorAPI: ErrorDetail | null,
        variables: PlanCategoryCreate
    ) => void
}

export const UsePostPlanCategory = ({
    onSuccess,
    onError,
    onSettled
}: UsePostPlanCategoryProps) => {
    const path = '/api/v1/plan-categories';
    const method = 'post';

    const postPlanCategory = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const createPlanCategoryMutation = useMutation({
        mutationKey: ['PostPlanCategory'],
        mutationFn: async (planCategory: PlanCategoryCreate) => {
            const requestBody = castRequestBody(planCategory, path, method) as NonNullable<Parameters<typeof postPlanCategory>[0]>
            const { data } = await postPlanCategory(requestBody)
            return data;
        },
        onSuccess: async (data: PlanCategoryResponse, variables: PlanCategoryCreate) => {
            await queryClient.invalidateQueries({
                queryKey: ['GetPlanCategories']
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

    return createPlanCategoryMutation;
}