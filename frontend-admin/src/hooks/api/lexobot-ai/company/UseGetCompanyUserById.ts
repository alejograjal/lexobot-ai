import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { CompanyUserResponse } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetCompanyUserById = (companyId: string | undefined, companyUserId: string | undefined): UseQueryResult<CompanyUserResponse, ApiError> => {
    const path = '/api/v1/companies/{company_id}/users/{company_user_id}';
    const method = 'get';

    const getCompanyUser = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetCompanyUser", companyUserId],
        queryFn: async () => {
            const { data } = await getCompanyUser(castRequestBody({ company_id: Number(companyId), company_user_id: Number(companyUserId) }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(companyId) && isPresent(companyUserId),
        staleTime: 0,
    })
}