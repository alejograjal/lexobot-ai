import { ErrorDetail } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UseDeleteCompanyUserProps {
    companyId: number
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

export const UseDeleteCompanyUser = ({
    companyId,
    onSuccess,
    onError,
    onSettled
}: UseDeleteCompanyUserProps) => {
    const path = '/api/v1/companies/{company_id}/users/{company_user_id}';
    const method = 'delete';

    const deleteCompanyUser = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const deleteCompanyUserMutation = useMutation({
        mutationKey: ['DeleteCompanyUser'],
        mutationFn: async (companyUserId: number) => {
            await deleteCompanyUser(castRequestBody({ company_id: companyId, company_user_id: companyUserId }, path, method))
            return undefined;
        },
        onSuccess: async (data: undefined, variables: number) => {
            await queryClient.invalidateQueries({
                queryKey: ['GetCompaniesUsers', companyId]
            })
            onSuccess?.(data, variables)
        },
        onError: (errorAPI: ApiError, _) => {
            const { error } = errorAPI.data
            onError?.(error as ErrorDetail, _)
        },
        onSettled: (data, errorAPI, variables) => {
            const { error } = errorAPI?.data ?? null
            onSettled?.(data, error as ErrorDetail, variables)
        }
    })

    return deleteCompanyUserMutation;
}