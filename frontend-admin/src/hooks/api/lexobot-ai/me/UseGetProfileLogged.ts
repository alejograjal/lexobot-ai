"use client"

import { UserProfile } from "@/types/lexobot-ai";
import { ApiError } from "openapi-typescript-fetch";
import { useTokenStore } from '@/stores/UseTokenStore';
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetProfileLogged = (): UseQueryResult<UserProfile | null, ApiError> => {
    const { accessToken } = useTokenStore();

    const path = '/api/v1/me';
    const method = 'get';

    const GetProfile = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetProfile"],
        queryFn: async () => {
            const { data } = await GetProfile(castRequestBody({}, path, method));
            return data
        },
        retry: false,
        enabled: !!accessToken,
        staleTime: 0,
    })
}