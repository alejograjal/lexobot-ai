import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorDetail, CompanyResponse, CompanyCreate } from "@/types/lexobot-ai";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePostCompanyProps {
    onSuccess?: (
        data: CompanyResponse,
        variables: CompanyCreate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: CompanyCreate
    ) => void,
    onSettled?: (
        data: CompanyResponse | undefined,
        errorAPI: ErrorDetail | null,
        variables: CompanyCreate
    ) => void
}

export const UsePostCompany = ({
    onSuccess,
    onError,
    onSettled
}: UsePostCompanyProps) => {
    const path = '/api/v1/companies';
    const method = 'post';

    const postCompany = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const createCompanyMutation = useMutation({
        mutationKey: ['PostCompany'],
        mutationFn: async (company: CompanyCreate) => {
            const requestBody = castRequestBody(company, path, method) as NonNullable<Parameters<typeof postCompany>[0]>
            const { data } = await postCompany(requestBody)
            return data;
        },
        onSuccess: async (data: CompanyResponse, variables: CompanyCreate) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['GetCompanies'],
                    exact: false
                }),
                queryClient.invalidateQueries({
                    queryKey: ['GetCompanyAccesses']
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

    return createCompanyMutation;
}