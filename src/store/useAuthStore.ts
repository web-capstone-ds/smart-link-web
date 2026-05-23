import { create } from "zustand";
import { login as requestLogin, logout as requestLogout, type AuthUser } from "@/api/auth";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "authUser";

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (payload: { username: string; password: string; remember: boolean }) => Promise<void>;
    logout: () => Promise<void>;
}

function readInitialUser() {
    if (typeof window === "undefined") return null;

    const rawUser = window.localStorage.getItem(USER_KEY) || window.sessionStorage.getItem(USER_KEY);
    if (!rawUser) return null;

    try {
        return JSON.parse(rawUser) as AuthUser;
    } catch {
        return null;
    }
}

function persistSession(user: AuthUser, accessToken: string, refreshToken: string | undefined, remember: boolean) {
    if (typeof window === "undefined") return;

    const primaryStorage = remember ? window.localStorage : window.sessionStorage;
    const secondaryStorage = remember ? window.sessionStorage : window.localStorage;

    secondaryStorage.removeItem(ACCESS_TOKEN_KEY);
    secondaryStorage.removeItem(REFRESH_TOKEN_KEY);
    secondaryStorage.removeItem(USER_KEY);

    primaryStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    primaryStorage.setItem(USER_KEY, JSON.stringify(user));

    if (refreshToken) {
        primaryStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
}

function clearSession() {
    if (typeof window === "undefined") return;

    for (const storage of [window.localStorage, window.sessionStorage]) {
        storage.removeItem(ACCESS_TOKEN_KEY);
        storage.removeItem(REFRESH_TOKEN_KEY);
        storage.removeItem(USER_KEY);
    }
}

export const useAuthStore = create<AuthState>((set) => {
    const initialUser = readInitialUser();

    return {
        user: initialUser,
        isAuthenticated: !!initialUser,
        login: async ({ username, password, remember }) => {
            const result = await requestLogin({ username, password });
            persistSession(result.user, result.accessToken, result.refreshToken, remember);
            set({ user: result.user, isAuthenticated: true });
        },
        logout: async () => {
            try {
                await requestLogout();
            } finally {
                clearSession();
                set({ user: null, isAuthenticated: false });
            }
        },
    };
});
