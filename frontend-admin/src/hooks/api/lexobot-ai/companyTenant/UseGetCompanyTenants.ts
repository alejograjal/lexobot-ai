import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { CompanyTenantResponse } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetCompanyTenants = (company_id: string | undefined): UseQueryResult<CompanyTenantResponse[], ApiError> => {
    const path = '/api/v1/company-tenant-assignments';
    const method = 'get';

    const getCompanyTenants = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetCompanyTenants", company_id],
        queryFn: async () => {
            const { data } = await getCompanyTenants(castRequestBody({ company_id: Number(company_id) }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(company_id),
        staleTime: 0,
    })
}