import { ErrorDetail } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UseDeleteCompanyAccessProps {
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

export const UseDeleteCompanyAccess = ({
    onSuccess,
    onError,
    onSettled
}: UseDeleteCompanyAccessProps) => {
    const path = '/api/v1/companies/{company_id}/accesses/{access_id}';
    const method = 'delete';

    const deleteCompanyAccess = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const deleteCompanyAccessMutation = useMutation({
        mutationKey: ['DeleteCompanyAccess'],
        mutationFn: async (companyAccessId: number) => {
            await deleteCompanyAccess(castRequestBody({ access_id: companyAccessId }, path, method))
            return undefined;
        },
        onSuccess: async (data: undefined, variables: number) => {
            await queryClient.invalidateQueries({
                queryKey: ['GetCompanyAccesses']
            })
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

    return deleteCompanyAccessMutation;
}