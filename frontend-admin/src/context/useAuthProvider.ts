"use client"

import Cookies from 'js-cookie';
import { formatErrorMessage } from '@/lib/utils';
import { UseSnackbar } from '@/stores/UseSnackbar';
import { useTokenStore } from '@/stores/UseTokenStore';
import { useCallback, useState, useEffect } from 'react';
import { LoginFormValues } from '@/app/login/LoginSchema';
import { ErrorDetail, TokenResponse, UserProfile } from '@/types/lexobot-ai';
import { UseGetProfileLogged } from '@/hooks/api/lexobot-ai/me/UseGetProfileLogged';
import { UsePostAuthentication } from '@/hooks/api/lexobot-ai/authentication/UsePostAuthentication';
import { UsePostRefreshAuthentication } from '@/hooks/api/lexobot-ai/authentication/UsePostRefreshAuthentication';

export const useAuthProvider = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [authLoaded, setAuthLoaded] = useState(false);
    const { setTokens, clearTokens, accessToken } = useTokenStore();
    const setSnackbarMessage = UseSnackbar((state) => state.setMessage);

    const isAuthenticated = !!accessToken;

    const { data, isLoading, isError } = UseGetProfileLogged(isAuthenticated);

    const { mutate: postAuthenticationUser } = UsePostAuthentication({
        onSuccess: (data: TokenResponse) => {
            setSnackbarMessage('Inicio de sesión válido', 'success');
            setTokens(data.access_token, data.refresh_token);
        },
        onError: (data: ErrorDetail) => {
            setSnackbarMessage(formatErrorMessage(data), 'error');
            logout();
        },
    });

    const { mutate: postRefreshAuthentication } = UsePostRefreshAuthentication({
        onSuccess: (data: TokenResponse) => {
            setTokens(data.access_token, data.refresh_token);
        },
        onError: (data: ErrorDetail) => {
            setSnackbarMessage(formatErrorMessage(data), 'error');
            logout();
        },
    })

    const login = useCallback(async (data: LoginFormValues) => {
        try {
            postAuthenticationUser(data);
        } catch (error) {
            setSnackbarMessage(`Error al intentar iniciar sesión: ${error}`, 'error');
        }
    }, [postAuthenticationUser, setSnackbarMessage]);

    const logout = useCallback(() => {
        clearTokens();
        setUserProfile(null);
    }, [clearTokens]);

    const refreshToken = useCallback(async () => {
        try {
            const refreshToken = Cookies.get('lexobot_refresh_token');
            if (!refreshToken) throw new Error('No refresh token');

            postRefreshAuthentication({ refresh_token: refreshToken });

            return true;
        } catch (error) {
            setSnackbarMessage('Error al intentar actualizar la sesión, por favor inicie sesión nuevamente', 'error');
        }
    }, [postRefreshAuthentication, setSnackbarMessage]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const checkTokenExpiration = () => {
            const token = accessToken;
            if (!token) return;

            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expiresIn = (payload.exp * 1000) - Date.now();

                if (expiresIn < 300000) {
                    refreshToken();
                }
            } catch (error) {
                console.error('Error checking token expiration:', error);
            }
        };

        const interval = setInterval(checkTokenExpiration, 60000);
        checkTokenExpiration();

        return () => clearInterval(interval);
    }, [isAuthenticated, accessToken, refreshToken]);

    useEffect(() => {
        if (!isAuthenticated) {
            setUserProfile(null);
            setAuthLoaded(true);
            return;
        }

        if (!isLoading && !isError && data) {
            setUserProfile(data);
            setAuthLoaded(true);
        } else if (isError) {
            setAuthLoaded(true);
        }
    }, [data, isLoading, isError, isAuthenticated]);

    return {
        isAuthenticated,
        login,
        logout,
        authLoaded,
        userProfile,
        refreshToken
    };
};