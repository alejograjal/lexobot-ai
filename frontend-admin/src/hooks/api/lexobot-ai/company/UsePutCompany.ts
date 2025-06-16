import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorDetail, CompanyResponse, CompanyUpdate } from "@/types/lexobot-ai";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePutCompanyProps {
    companyId: number
    onSuccess?: (
        data: CompanyResponse,
        variables: CompanyUpdate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: CompanyUpdate
    ) => void,
    onSettled?: (
        data: CompanyResponse | undefined,
        error: ErrorDetail | null,
        variables: CompanyUpdate
    ) => void
}

export const UsePutCompany = ({
    companyId,
    onSuccess,
    onError,
    onSettled
}: UsePutCompanyProps) => {
    const path = '/api/v1/companies/{company_id}';
    const method = 'patch';

    const putCompany = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const updateCompanyMutation = useMutation({
        mutationKey: ['PutCompany'],
        mutationFn: async (company: CompanyUpdate) => {
            const requestBody = castRequestBody({ company_id: companyId, ...company }, path, method) as NonNullable<Parameters<typeof putCompany>[0]>
            const { data } = await putCompany(requestBody);
            return data;
        },
        onSuccess: async (data: CompanyResponse, variables: CompanyUpdate) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['GetCompany', companyId.toString()],
                    exact: true
                }),
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
            const { error } = errorAPI.data
            onError?.(error as ErrorDetail, _)
        },
        onSettled: (data, errorAPI, variables) => {
            const { error } = errorAPI?.data ?? null
            onSettled?.(data, error, variables)
        }
    })

    return updateCompanyMutation;
}