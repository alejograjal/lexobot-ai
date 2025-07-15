import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";
import { ErrorDetail, TenantPlanAssignmentResponse, TenantPlanAssignmentUpdate } from "@/types/lexobot-ai";

interface UsePutTenantPlanAssignmentProps {
    tenantId: number
    assignmentId: number
    onSuccess?: (
        data: TenantPlanAssignmentResponse,
        variables: TenantPlanAssignmentUpdate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: TenantPlanAssignmentUpdate
    ) => void,
    onSettled?: (
        data: TenantPlanAssignmentResponse | undefined,
        error: ErrorDetail | null,
        variables: TenantPlanAssignmentUpdate
    ) => void
}

export const UsePutTenantPlanAssignment = ({
    tenantId,
    assignmentId,
    onSuccess,
    onError,
    onSettled
}: UsePutTenantPlanAssignmentProps) => {
    const path = '/api/v1/tenants/{tenant_id}/plans/{assignment_id}';
    const method = 'patch';

    const putTenantPlanAssignment = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const updateTenantPlanAssignmentMutation = useMutation({
        mutationKey: ['PutTenantPlanAssignment', tenantId, assignmentId],
        mutationFn: async (tenantPlanAssignment: TenantPlanAssignmentUpdate) => {
            const requestBody = castRequestBody({ tenant_id: tenantId, assignment_id: assignmentId, ...tenantPlanAssignment }, path, method) as NonNullable<Parameters<typeof putTenantPlanAssignment>[0]>
            const { data } = await putTenantPlanAssignment(requestBody);
            return data;
        },
        onSuccess: async (data: TenantPlanAssignmentResponse, variables: TenantPlanAssignmentUpdate) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['GetTenantPlanAssignment', tenantId.toString(), assignmentId.toString()],
                    exact: true
                }),
                queryClient.invalidateQueries({
                    queryKey: ['GetTenantPlanAssignments', tenantId.toString()],
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

    return updateTenantPlanAssignmentMutation;
}