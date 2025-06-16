import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { TenantResponse } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetTenantsAvailableByCompany = (companyId: string | undefined): UseQueryResult<TenantResponse[], ApiError> => {
    const path = '/api/v1/tenants/available';
    const method = 'get';

    const getAvailableTenants = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetTenants"],
        queryFn: async () => {
            const { data } = await getAvailableTenants(castRequestBody({ company_id: Number(companyId) }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(companyId),
        staleTime: 0,
    })
}