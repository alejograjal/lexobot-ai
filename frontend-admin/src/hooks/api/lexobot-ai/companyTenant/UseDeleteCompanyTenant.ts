import { ErrorDetail } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UseDeleteCompanyTenantProps {
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

export const UseDeleteCompanyTenant = ({
    onSuccess,
    onError,
    onSettled
}: UseDeleteCompanyTenantProps) => {
    const path = '/api/v1/company-tenant-assignments/{assignment_id}';
    const method = 'delete';

    const deleteCompanyTenant = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const deleteCompanyTenantMutation = useMutation({
        mutationKey: ['DeleteCompanyTenant'],
        mutationFn: async (assignmentId: number) => {
            await deleteCompanyTenant(castRequestBody({ assignment_id: assignmentId }, path, method))
            return undefined;
        },
        onSuccess: async (data: undefined, variables: number) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['GetCompanies'],
                    exact: true
                }),
                queryClient.invalidateQueries({
                    queryKey: ['GetCompany', variables.toString()],
                    exact: true
                }),
                queryClient.invalidateQueries({
                    queryKey: ['GetCompanyTenants', variables.toString()],
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

    return deleteCompanyTenantMutation;
}