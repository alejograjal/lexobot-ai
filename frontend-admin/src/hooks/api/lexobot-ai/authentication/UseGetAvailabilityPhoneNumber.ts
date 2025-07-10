import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetAvailabilityPhoneNumber = (phoneNumber: string | undefined): UseQueryResult<boolean, ApiError> => {
    const path = '/api/v1/auth/user/check-availability';
    const method = 'get';

    const getCompany = UseTypedApiClientLA({ path, method, disableAuth: true })

    return useQuery({
        queryKey: ["CheckPhoneNumber", phoneNumber],
        queryFn: async () => {
            const { data } = await getCompany(castRequestBody({ phone_number: phoneNumber }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(phoneNumber),
        staleTime: 0,
    })
}