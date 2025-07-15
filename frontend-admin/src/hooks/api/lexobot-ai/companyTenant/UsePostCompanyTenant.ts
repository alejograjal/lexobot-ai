import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorDetail, CompanyTenantResponse, CompanyTenantCreate } from "@/types/lexobot-ai";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePostCompanyTenantProps {
    onSuccess?: (
        data: CompanyTenantResponse,
        variables: CompanyTenantCreate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: CompanyTenantCreate
    ) => void,
    onSettled?: (
        data: CompanyTenantResponse | undefined,
        errorAPI: ErrorDetail | null,
        variables: CompanyTenantCreate
    ) => void
}

export const UsePostCompanyTenant = ({
    onSuccess,
    onError,
    onSettled
}: UsePostCompanyTenantProps) => {
    const path = '/api/v1/company-tenant-assignments';
    const method = 'post';

    const postCompanyTenant = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const createCompanyTenantMutation = useMutation({
        mutationKey: ['PostCompanyTenant'],
        mutationFn: async (companyTenant: CompanyTenantCreate) => {
            const requestBody = castRequestBody({ ...companyTenant }, path, method) as NonNullable<Parameters<typeof postCompanyTenant>[0]>
            const { data } = await postCompanyTenant(requestBody)
            return data;
        },
        onSuccess: async (data: CompanyTenantResponse, variables: CompanyTenantCreate) => {
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

    return createCompanyTenantMutation;
}