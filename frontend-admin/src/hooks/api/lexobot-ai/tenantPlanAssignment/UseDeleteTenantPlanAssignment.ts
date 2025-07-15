import { ErrorDetail } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UseDeleteTenantPlanAssignmentProps {
    tenantId: number,
    assignmentId: number
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

export const UseDeleteTenantPlanAssignment = ({
    tenantId,
    assignmentId,
    onSuccess,
    onError,
    onSettled
}: UseDeleteTenantPlanAssignmentProps) => {
    const path = '/api/v1/tenants/{tenant_id}/plans/{assignment_id}';
    const method = 'delete';

    const deleteTenantPlanAssignment = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const deleteTenantPlanAssignmentMutation = useMutation({
        mutationKey: ['DeleteTenantPlanAssignment', tenantId, assignmentId],
        mutationFn: async () => {
            await deleteTenantPlanAssignment(castRequestBody({ tenantId, assignmentId }, path, method))
            return undefined;
        },
        onSuccess: async (data: undefined, variables: number) => {
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

    return deleteTenantPlanAssignmentMutation;
}