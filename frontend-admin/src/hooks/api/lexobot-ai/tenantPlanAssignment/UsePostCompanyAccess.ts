import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";
import { ErrorDetail, TenantPlanAssignmentResponse, TenantPlanAssignmentCreate } from "@/types/lexobot-ai";

interface UsePostTenantPlanAssignmentProps {
    tenantId: number
    onSuccess?: (
        data: TenantPlanAssignmentResponse,
        variables: TenantPlanAssignmentCreate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: TenantPlanAssignmentCreate
    ) => void,
    onSettled?: (
        data: TenantPlanAssignmentResponse | undefined,
        errorAPI: ErrorDetail | null,
        variables: TenantPlanAssignmentCreate
    ) => void
}

export const UsePostTenantPlanAssignment = ({
    tenantId,
    onSuccess,
    onError,
    onSettled
}: UsePostTenantPlanAssignmentProps) => {
    const path = '/api/v1/tenants/{tenant_id}/plans';
    const method = 'post';

    const postTenantPlanAssignment = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const createTenantPlanAssignmentMutation = useMutation({
        mutationKey: ['PostTenantPlanAssignment', tenantId],
        mutationFn: async (tenantPlanAssignment: TenantPlanAssignmentCreate) => {
            const requestBody = castRequestBody({ tenant_id: tenantId, ...tenantPlanAssignment }, path, method) as NonNullable<Parameters<typeof postTenantPlanAssignment>[0]>
            const { data } = await postTenantPlanAssignment(requestBody)
            return data;
        },
        onSuccess: async (data: TenantPlanAssignmentResponse, variables: TenantPlanAssignmentCreate) => {
            await queryClient.invalidateQueries({
                queryKey: ['GetTenantPlanAssignments', tenantId.toString()],
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

    return createTenantPlanAssignmentMutation;
}