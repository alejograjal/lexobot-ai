// stores/tokenStore.ts
import { create } from 'zustand';
import Cookies from 'js-cookie';

const ACCESS_COOKIE = 'lexobot_access_token';
const REFRESH_COOKIE = 'lexobot_refresh_token';

interface TokenStore {
    accessToken: string | null;
    refreshToken: string | null;
    setTokens: (accessToken: string, refreshToken: string) => void;
    clearTokens: () => void;
    getAccessToken: () => string | null;
    getRefreshToken: () => string | null;
}

export const useTokenStore = create<TokenStore>((set, get) => ({
    accessToken: Cookies.get(ACCESS_COOKIE) || null,
    refreshToken: Cookies.get(REFRESH_COOKIE) || null,
    setTokens: (accessToken, refreshToken) => {
        Cookies.set(ACCESS_COOKIE, accessToken, { expires: 1 / 24 });
        Cookies.set(REFRESH_COOKIE, refreshToken, { expires: 30 });
        set({ accessToken, refreshToken });
    },
    clearTokens: () => {
        Cookies.remove(ACCESS_COOKIE);
        Cookies.remove(REFRESH_COOKIE);
        set({ accessToken: null, refreshToken: null });
    },
    getAccessToken: () => get().accessToken,
    getRefreshToken: () => get().refreshToken,
}));
