import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { CompanyAccessResponse } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetCompanyAccesses = (companyId: string | undefined): UseQueryResult<CompanyAccessResponse[], ApiError> => {
    const path = '/api/v1/companies/{company_id}/accesses';
    const method = 'get';

    const getCompanyAccesses = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetCompanyAccesses", companyId],
        queryFn: async () => {
            const { data } = await getCompanyAccesses(castRequestBody({ company_id: Number(companyId) }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(companyId),
        staleTime: 0,
    })
}