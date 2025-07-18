import { ApiError } from "openapi-typescript-fetch";
import { ErrorDetail, CompanyTenantBulk } from "@/types/lexobot-ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePutCompanyTenantProps {
    onSuccess?: (
        data: undefined,
        variables: CompanyTenantBulk
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: CompanyTenantBulk
    ) => void,
    onSettled?: (
        data: undefined | undefined,
        error: ErrorDetail | null,
        variables: CompanyTenantBulk
    ) => void
}

export const UsePutBulkCompanyTenant = ({
    onSuccess,
    onError,
    onSettled
}: UsePutCompanyTenantProps) => {
    const path = '/api/v1/company-tenant-assignments/bulk-sync';
    const method = 'put';

    const postBulkCompanyTenant = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const postBulkCompanyTenantMutation = useMutation({
        mutationKey: ['PostBulkCompanyTenant'],
        mutationFn: async (companyTenants: CompanyTenantBulk) => {
            const requestBody = castRequestBody({ ...companyTenants }, path, method) as NonNullable<Parameters<typeof postBulkCompanyTenant>[0]>
            await postBulkCompanyTenant(requestBody);
            return undefined;
        },
        onSuccess: async (data: undefined, variables: CompanyTenantBulk) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['GetCompanies'],
                    exact: true
                }),
                queryClient.invalidateQueries({
                    queryKey: ['GetCompany', variables.company_id.toString()],
                    exact: true
                }),
                queryClient.invalidateQueries({
                    queryKey: ['GetCompanyTenants'],
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

    return postBulkCompanyTenantMutation;
}