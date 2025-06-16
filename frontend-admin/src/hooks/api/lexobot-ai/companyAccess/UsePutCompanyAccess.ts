import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";
import { ErrorDetail, CompanyAccessResponse, CompanyAccessUpdate } from "@/types/lexobot-ai";

interface UsePutCompanyAccessProps {
    companyId: number
    companyAccessId: number
    onSuccess?: (
        data: CompanyAccessResponse,
        variables: CompanyAccessUpdate
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables: CompanyAccessUpdate
    ) => void,
    onSettled?: (
        data: CompanyAccessResponse | undefined,
        error: ErrorDetail | null,
        variables: CompanyAccessUpdate
    ) => void
}

export const UsePutCompanyAccess = ({
    companyId,
    companyAccessId,
    onSuccess,
    onError,
    onSettled
}: UsePutCompanyAccessProps) => {
    const path = '/api/v1/companies/{company_id}/accesses/{access_id}';
    const method = 'patch';

    const putCompanyAccess = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const updateCompanyAccessMutation = useMutation({
        mutationKey: ['PutCompanyAccess'],
        mutationFn: async (companyAccess: CompanyAccessUpdate) => {
            const requestBody = castRequestBody({ company_id: companyId, access_id: companyAccessId, ...companyAccess }, path, method) as NonNullable<Parameters<typeof putCompanyAccess>[0]>
            const { data } = await putCompanyAccess(requestBody);
            return data;
        },
        onSuccess: async (data: CompanyAccessResponse, variables: CompanyAccessUpdate) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['GetCompanyAccess', companyAccessId.toString()],
                    exact: true
                }),
                queryClient.invalidateQueries({
                    queryKey: ['GetCompanyAccesses'],
                    exact: false
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

    return updateCompanyAccessMutation;
}