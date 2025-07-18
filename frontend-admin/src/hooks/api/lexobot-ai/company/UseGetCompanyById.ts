import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { CompanyResponse } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetCompanyById = (companyId: string | undefined): UseQueryResult<CompanyResponse, ApiError> => {
    const path = '/api/v1/companies/{company_id}';
    const method = 'get';

    const getCompany = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetCompany", companyId],
        queryFn: async () => {
            const { data } = await getCompany(castRequestBody({ company_id: Number(companyId) }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(companyId),
        staleTime: 0,
    })
}