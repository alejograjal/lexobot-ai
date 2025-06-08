import { ApiError } from "openapi-typescript-fetch";
import { CompanyResponse } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientBS } from "@/hooks/UseTypedApiClientLA";

export const UseGetCompanies = (): UseQueryResult<CompanyResponse[], ApiError> => {
    const path = '/api/v1/companies';
    const method = 'get';

    const getCompanies = UseTypedApiClientBS({ path, method })

    return useQuery({
        queryKey: ["GetCompanies"],
        queryFn: async () => {
            const { data } = await getCompanies(castRequestBody({}, path, method));
            return data
        },
        retry: false,
        staleTime: 0,
    })
}