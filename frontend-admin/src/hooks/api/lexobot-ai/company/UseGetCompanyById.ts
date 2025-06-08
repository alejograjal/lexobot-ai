import { isPresent } from "@/lib/utils";
import { CompanyUpdate } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientBS } from "@/hooks/UseTypedApiClientLA";

export const UseGetCompanyById = (companyId: string | undefined): UseQueryResult<CompanyUpdate, ApiError> => {
    const path = '/api/v1/companies/{company_id}';
    const method = 'get';

    const getCompany = UseTypedApiClientBS({ path, method })

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