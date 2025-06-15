import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";
import { ErrorDetail, CompanyAccessResponse, CompanyAccessCreate } from "@/types/lexobot-ai";

interface UsePostCompanyAccessProps {
    companyId: number
    onSuccess?: (
        data: CompanyAccessResponse,
        variables: CompanyAccessCreate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: CompanyAccessCreate
    ) => void,
    onSettled?: (
        data: CompanyAccessResponse | undefined,
        errorAPI: ErrorDetail | null,
        variables: CompanyAccessCreate
    ) => void
}

export const UsePostCompanyAccess = ({
    companyId,
    onSuccess,
    onError,
    onSettled
}: UsePostCompanyAccessProps) => {
    const path = '/api/v1/companies/{company_id}/accesses';
    const method = 'post';

    const postCompanyAccess = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const createCompanyAccessMutation = useMutation({
        mutationKey: ['PostCompanyAccess'],
        mutationFn: async (companyAccess: CompanyAccessCreate) => {
            const requestBody = castRequestBody({ company_id: companyId, ...companyAccess }, path, method) as NonNullable<Parameters<typeof postCompanyAccess>[0]>
            const { data } = await postCompanyAccess(requestBody)
            return data;
        },
        onSuccess: async (data: CompanyAccessResponse, variables: CompanyAccessCreate) => {
            await queryClient.invalidateQueries({
                queryKey: ['GetCompanyAccesses']
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

    return createCompanyAccessMutation;
}