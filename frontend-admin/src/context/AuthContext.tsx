"use client"

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { UserProfile } from '@/types/lexobot-ai';
import { formatErrorMessage } from '@/lib/utils';
import { UseSnackbar } from '@stores/UseSnackbar';
import { LoginFormValues } from '@/app/login/LoginSchema';
import { TokenResponse, ErrorDetail } from '@/types/lexobot-ai';
import { UseGetProfileLogged } from '@/hooks/api/lexobot-ai/me/UseGetProfileLogged';
import { UsePostAuthentication } from '@/hooks/api/lexobot-ai/authentication/UsePostAuthentication';
import { createContext, ReactNode, useCallback, useState, useContext, useEffect, useMemo } from 'react';
import { UsePostRefreshAuthentication } from '@/hooks/api/lexobot-ai/authentication/UsePostRefreshAuthentication';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (data: LoginFormValues) => Promise<void>;
    logout: () => void;
    refreshTokens: () => void;
    authLoaded: boolean;
    userProfile: UserProfile | null;
}

interface DecodedToken {
    exp: number;
    [key: string]: unknown;
    FullName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoaded, setAuthLoaded] = useState(false);
    const setSnackbarMessage = UseSnackbar((state) => state.setMessage);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
        if (typeof window === "undefined") return null;
        const stored = localStorage.getItem("user_profile");
        return stored ? JSON.parse(stored) : null;
    });

    const getToken = useCallback(() => Cookies.get('access_token'), []);
    const getRefreshToken = useCallback(() => Cookies.get('refresh_token'), []);

    const { mutate: postAuthenticationUser } = UsePostAuthentication({
        onSuccess: (data: TokenResponse) => {
            setSnackbarMessage('Inicio de sesión válido', 'success');
            Cookies.set('access_token', String(data.access_token), { expires: 1 / 24 });
            Cookies.set('refresh_token', String(data.refresh_token), { expires: 30 });
            setIsAuthenticated(true);
        },
        onError: (data: ErrorDetail) => {
            setSnackbarMessage(formatErrorMessage(data), 'error');
            logout();
        },
    });

    const login = useCallback(async (data: LoginFormValues) => {
        try {
            postAuthenticationUser(data);
        } catch (error) {
            setSnackbarMessage(`Error al intentar iniciar sesión: ${error}`, 'error');
        }
    }, [postAuthenticationUser, setSnackbarMessage]);

    const logout = useCallback(() => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        localStorage.removeItem("user_profile");
        setUserProfile(null);
        setIsAuthenticated(false);
    }, []);

    const { mutate: refreshTokenMutation } = UsePostRefreshAuthentication({
        onSuccess: (data: TokenResponse) => {
            Cookies.set('access_token', String(data.access_token), { expires: 1 / 24 });
            Cookies.set('refresh_token', String(data.refresh_token), { expires: 30 });
            setIsAuthenticated(true);
            setSnackbarMessage(`Token actualizado correctamente`)
        },
        onError: (data: ErrorDetail) => {
            setSnackbarMessage(formatErrorMessage(data), 'error');
            logout();
        },
    });

    const refreshTokens = useCallback(() => {
        const token = getToken();
        const refreshToken = getRefreshToken();

        if (!token || !refreshToken) {
            setSnackbarMessage(`Por favor inice sesión`, 'error');
            logout();
            return;
        }

        try {
            const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp && decodedToken.exp < currentTime) {
                setSnackbarMessage('El token ha expirado. Refrescando...', 'info');
                refreshTokenMutation({ refresh_token: refreshToken });
            }
        } catch {
            setSnackbarMessage('Error al intentar verificar el token', 'error');
        }
    }, [getToken, getRefreshToken, setSnackbarMessage, refreshTokenMutation, logout]);


    const { data, isLoading, isError } = UseGetProfileLogged(isAuthenticated);

    useEffect(() => {
        if (!isLoading && !isError && data) {
            setUserProfile(data);
            localStorage.setItem("user_profile", JSON.stringify(data));
        } else if (isError) {
            logout();
        }
    }, [data, isLoading, isError, logout, isAuthenticated]);


    useEffect(() => {
        if (isAuthenticated) {
            refreshTokens();
        }
    }, [isAuthenticated, refreshTokens]);

    useEffect(() => {
        const token = getToken();
        const refreshToken = getRefreshToken();

        if (token && refreshToken) {
            try {
                const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp && decodedToken.exp < currentTime) {
                    refreshTokens();
                } else {
                    setIsAuthenticated(true);
                }
            } catch {
                setSnackbarMessage('Error al intentar verificar el token', 'error');
                logout();
            }
        } else {
            setIsAuthenticated(false);
        }

        setAuthLoaded(true);
    }, [getToken, getRefreshToken, logout, refreshTokens, setSnackbarMessage]);

    const contextValue = useMemo(() => ({
        isAuthenticated,
        login,
        logout,
        refreshTokens,
        authLoaded,
        userProfile,
    }), [isAuthenticated, login, logout, refreshTokens, authLoaded, userProfile]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};


export { AuthProvider, useAuth };