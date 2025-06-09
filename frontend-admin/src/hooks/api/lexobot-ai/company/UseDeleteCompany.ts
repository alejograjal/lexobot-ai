import { ErrorDetail } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UseDeleteCompanyProps {
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

export const UseDeleteCompany = ({
    onSuccess,
    onError,
    onSettled
}: UseDeleteCompanyProps) => {
    const path = '/api/v1/companies/{company_id}';
    const method = 'delete';

    const deleteCompany = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const deleteBranchMutation = useMutation({
        mutationKey: ['DeleteCompany'],
        mutationFn: async (companyId: number) => {
            await deleteCompany(castRequestBody({ company_id: companyId }, path, method))
            return undefined;
        },
        onSuccess: async (data: undefined, variables: number) => {
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
            onSettled?.(data, error as ErrorDetail, variables)
        }
    })

    return deleteBranchMutation;
}