import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorDetail, CompanyUserResponse, CompanyUserUpdate } from "@/types/lexobot-ai";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePutCompanyUserProps {
    companyId: number,
    companyUserId: number
    onSuccess?: (
        data: CompanyUserResponse,
        variables: CompanyUserUpdate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: CompanyUserUpdate
    ) => void,
    onSettled?: (
        data: CompanyUserResponse | undefined,
        error: ErrorDetail | null,
        variables: CompanyUserUpdate
    ) => void
}

export const UsePutCompanyUser = ({
    companyId,
    companyUserId,
    onSuccess,
    onError,
    onSettled
}: UsePutCompanyUserProps) => {
    const path = '/api/v1/companies/{company_id}/users/{company_user_id}';
    const method = 'patch';

    const putCompanyUser = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const updateCompanyUserMutation = useMutation({
        mutationKey: ['PutCompany'],
        mutationFn: async (company: CompanyUserUpdate) => {
            const requestBody = castRequestBody({ company_id: companyId, company_user_id: companyUserId, ...company }, path, method) as NonNullable<Parameters<typeof putCompanyUser>[0]>
            const { data } = await putCompanyUser(requestBody);
            return data;
        },
        onSuccess: async (data: CompanyUserResponse, variables: CompanyUserUpdate) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['GetCompaniesUser', companyId],
                    exact: false
                }),
                queryClient.invalidateQueries({
                    queryKey: ['GetCompanyUser', companyUserId],
                    exact: false
                }),
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

    return updateCompanyUserMutation;
}