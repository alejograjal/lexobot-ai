"use client";

import createClient from "openapi-fetch"
import { paths } from "@/api/clients/lexobot-ai/api";
import { useTokenStore } from '@/stores/UseTokenStore';

export const useApiClient = () => {
    const { getAccessToken } = useTokenStore();
    const token = getAccessToken();

    return createClient<paths>({
        baseUrl: process.env.NEXT_PUBLIC_API_LEXOBOT_URL,
        headers: {
            Authorization: `Bearer ${token ?? ''}`
        }
    });
}