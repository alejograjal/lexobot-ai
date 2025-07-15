import { ErrorDetail } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

interface UsePostCompanyUserResendInviteProps {
    companyId: number,
    companyUserId: number,
    onSuccess?: (
        data: boolean,
        variables?: null
    ) => void,
    onError?: (
        data: ErrorDetail,
        variables?: null
    ) => void,
    onSettled?: (
        data: boolean | undefined,
        errorAPI: ErrorDetail | null,
        variables?: null
    ) => void
}

export const UsePostCompanyUserResendInvite = ({
    companyId,
    companyUserId,
    onSuccess,
    onError,
    onSettled
}: UsePostCompanyUserResendInviteProps) => {
    const path = '/api/v1/companies/{company_id}/users/{company_user_id}/resend-invite';
    const method = 'post';

    const postCompanyUserResendInvite = UseTypedApiClientLA({ path, method })
    const queryClient = useQueryClient();

    const createCompanyUserMutation = useMutation({
        mutationKey: ['PostCompanyUserResendInvite', companyId, companyUserId],
        mutationFn: async () => {
            const requestBody = castRequestBody({ company_id: companyId, company_user_id: companyUserId }, path, method) as NonNullable<Parameters<typeof postCompanyUserResendInvite>[0]>
            const { data } = await postCompanyUserResendInvite(requestBody)
            return data;
        },
        onSuccess: async (data: boolean, variables?: null) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['GetCompaniesUsers', companyId],
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

    return createCompanyUserMutation;
}