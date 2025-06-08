import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorDetail, CompanyResponse, CompanyCreate } from "@/types/lexobot-ai";
import { castRequestBody, UseTypedApiClientBS } from "@/hooks/UseTypedApiClientLA";

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

    const postCompany = UseTypedApiClientBS({ path, method })
    const queryClient = useQueryClient();

    const createBranchMutation = useMutation({
        mutationKey: ['PostCompany'],
        mutationFn: async (company: CompanyCreate) => {
            const requestBody = castRequestBody(company, path, method) as NonNullable<Parameters<typeof postCompany>[0]>
            const { data } = await postCompany(requestBody)
            return data;
        },
        onSuccess: async (data: CompanyResponse, variables: CompanyCreate) => {
            await queryClient.invalidateQueries({
                queryKey: ['GetCompanies']
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

    return createBranchMutation;
}