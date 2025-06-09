"use client"

import { useAuthProvider } from './useAuthProvider';
import { createContext, ReactNode, useContext, useMemo } from 'react';

const AuthContext = createContext<ReturnType<typeof useAuthProvider> | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const auth = useAuthProvider();
    const contextValue = useMemo(() => auth, [auth]);

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return context;
};