import { ApiError } from "openapi-typescript-fetch";
import { ErrorDetail, CompanyUserBulk } from "@/types/lexobot-ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePutBulkCompanyUsersProps {
    companyId: number
    onSuccess?: (
        data: undefined,
        variables: CompanyUserBulk
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: CompanyUserBulk
    ) => void,
    onSettled?: (
        data: undefined | undefined,
        error: ErrorDetail | null,
        variables: CompanyUserBulk
    ) => void
}

export const UsePutBulkCompanyUsers = ({
    companyId,
    onSuccess,
    onError,
    onSettled
}: UsePutBulkCompanyUsersProps) => {
    const path = '/api/v1/companies/{company_id}/users/bulk-sync';
    const method = 'put';

    const postBulkCompanyUser = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const postBulkCompanyUsersMutation = useMutation({
        mutationKey: ['PostBulkCompanyUsers'],
        mutationFn: async (companyUsers: CompanyUserBulk) => {
            const body = castRequestBody({ company_id: companyId, ...companyUsers }, path, method) as Parameters<typeof postBulkCompanyUser>[0]
            await postBulkCompanyUser(body);
            return undefined;
        },
        onSuccess: async (data: undefined, variables: CompanyUserBulk) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['GetCompaniesUsers', companyId],
                    exact: true
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

    return postBulkCompanyUsersMutation;
}