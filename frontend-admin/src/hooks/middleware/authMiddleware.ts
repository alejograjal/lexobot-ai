"use client";

import { Fetcher } from "openapi-typescript-fetch";
import { UseSnackbar } from "@/stores/UseSnackbar";
import { ApiError } from "openapi-typescript-fetch";
import { paths } from "@api/clients/lexobot-ai/api";
import { Middleware } from "openapi-typescript-fetch";
import { useTokenStore } from '@/stores/UseTokenStore';

export const createAuthMiddleware = (baseUrl: string): Middleware => {
    const setSnackbarMessage = UseSnackbar((state) => state.setMessage);

    return async (url, init, next) => {
        const tokenStore = useTokenStore.getState();
        const originalRequest = () => next(url, init);

        try {
            return await originalRequest();
        } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
                const refreshToken = tokenStore.getRefreshToken();

                if (!refreshToken) {
                    setSnackbarMessage('Sesión expirada. Por favor inicie sesión nuevamente', 'error');
                    tokenStore.clearTokens();
                    throw new Error('SESSION_EXPIRED');
                }

                try {
                    const refreshFetcher = Fetcher.for<paths>();
                    refreshFetcher.configure({
                        baseUrl,
                        init: {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        },
                    });

                    const refreshEndpoint = refreshFetcher.path('/api/v1/auth/refresh').method('post').create();
                    const { data } = await refreshEndpoint({ refresh_token: refreshToken } as never);

                    tokenStore.setTokens(data.access_token, data.refresh_token);

                    const newInit = {
                        ...init,
                        headers: {
                            ...init?.headers,
                            Authorization: `Bearer ${data.access_token}`,
                        },
                    };

                    return next(url, newInit);
                } catch (refreshError) {
                    setSnackbarMessage('No se pudo renovar la sesión. Por favor inicie sesión nuevamente', 'error');
                    tokenStore.clearTokens();
                    throw new Error('REFRESH_FAILED');
                }
            }

            throw error;
        }
    };
};