import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { CompanyUserResponse } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetCompanyUsers = (companyId: string | undefined): UseQueryResult<CompanyUserResponse[], ApiError> => {
    const path = '/api/v1/companies/{company_id}/users';
    const method = 'get';

    const getCompaniesUsers = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetCompaniesUsers", companyId],
        queryFn: async () => {
            const { data } = await getCompaniesUsers(castRequestBody({ company_id: Number(companyId) }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(companyId),
        staleTime: 0,
    })
}