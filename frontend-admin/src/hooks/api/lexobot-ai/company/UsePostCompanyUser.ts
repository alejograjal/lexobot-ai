import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";
import { ErrorDetail, CompanyUserResponse, CompanyUserCreate } from "@/types/lexobot-ai";

interface UsePostCompanyUserProps {
    companyId: number,
    onSuccess?: (
        data: CompanyUserResponse,
        variables: CompanyUserCreate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: CompanyUserCreate
    ) => void,
    onSettled?: (
        data: CompanyUserResponse | undefined,
        errorAPI: ErrorDetail | null,
        variables: CompanyUserCreate
    ) => void
}

export const UsePostCompanyUser = ({
    companyId,
    onSuccess,
    onError,
    onSettled
}: UsePostCompanyUserProps) => {
    const path = '/api/v1/companies/{company_id}/users';
    const method = 'post';

    const postCompanyUser = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const createCompanyUserMutation = useMutation({
        mutationKey: ['PostCompanyUser', companyId],
        mutationFn: async (company: CompanyUserCreate) => {
            const requestBody = castRequestBody({ company_id: companyId, ...company }, path, method) as NonNullable<Parameters<typeof postCompanyUser>[0]>
            const { data } = await postCompanyUser(requestBody)
            return data;
        },
        onSuccess: async (data: CompanyUserResponse, variables: CompanyUserCreate) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['GetCompaniesUsers', companyId],
                    exact: false
                }),
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

    return createCompanyUserMutation;
}