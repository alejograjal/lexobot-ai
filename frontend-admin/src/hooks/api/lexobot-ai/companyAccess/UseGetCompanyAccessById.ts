import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { CompanyAccessResponse } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetCompanyAccessById = (companyAccessId: string | undefined): UseQueryResult<CompanyAccessResponse, ApiError> => {
    const path = '/api/v1/companies/{company_id}/accesses/{access_id}';
    const method = 'get';

    const getCompanyAccess = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetCompanyAccess", companyAccessId],
        queryFn: async () => {
            const { data } = await getCompanyAccess(castRequestBody({ access_id: Number(companyAccessId) }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(companyAccessId),
        staleTime: 0,
    })
}