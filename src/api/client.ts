import axios from "axios";

const AUTH_TOKEN_KEYS = ["accessToken", "token", "jwt"];
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "authUser";
const USE_MOCK_DATA_KEY = "useMockData";
const DEV_ACCESS_TOKEN = "dev-temp-user-token";

let refreshRequest: Promise<string | null> | null = null;

function getStoredAuthToken() {
    if (typeof window === "undefined") return null;

    for (const key of AUTH_TOKEN_KEYS) {
        const token = window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
        if (token) return token;
    }

    return null;
}

function getStoredRefreshToken() {
    if (typeof window === "undefined") return null;

    return window.localStorage.getItem(REFRESH_TOKEN_KEY) || window.sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

function getPrimaryAuthStorage() {
    if (typeof window === "undefined") return null;

    if (window.localStorage.getItem("accessToken") || window.localStorage.getItem(REFRESH_TOKEN_KEY)) {
        return window.localStorage;
    }

    if (window.sessionStorage.getItem("accessToken") || window.sessionStorage.getItem(REFRESH_TOKEN_KEY)) {
        return window.sessionStorage;
    }

    return window.localStorage;
}

function persistRefreshedTokens(accessToken: string, refreshToken?: string) {
    const storage = getPrimaryAuthStorage();
    if (!storage) return;

    storage.setItem("accessToken", accessToken);
    if (refreshToken) {
        storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
}

function clearStoredSession() {
    if (typeof window === "undefined") return;

    for (const storage of [window.localStorage, window.sessionStorage]) {
        storage.removeItem("accessToken");
        storage.removeItem(REFRESH_TOKEN_KEY);
        storage.removeItem(USER_KEY);
        storage.removeItem(USE_MOCK_DATA_KEY);
    }
}

async function refreshAccessToken() {
    const currentToken = getStoredAuthToken();
    const refreshToken = getStoredRefreshToken();

    if (!refreshToken || currentToken === DEV_ACCESS_TOKEN) return null;

    if (!refreshRequest) {
        refreshRequest = axios.post("/api/v1/auth/refresh", { refreshToken })
            .then((response) => {
                const body = response.data;
                const data = body?.data || body;
                const accessToken = data?.accessToken || data?.token;

                if (!accessToken) return null;

                persistRefreshedTokens(accessToken, data?.refreshToken);
                return accessToken as string;
            })
            .catch(() => {
                clearStoredSession();
                return null;
            })
            .finally(() => {
                refreshRequest = null;
            });
    }

    return refreshRequest;
}

export const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
    const token = getStoredAuthToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const url = originalRequest?.url || "";

        if (
            status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            url.includes("/api/v1/auth/login") ||
            url.includes("/api/v1/auth/refresh")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;
        const accessToken = await refreshAccessToken();

        if (!accessToken) {
            return Promise.reject(error);
        }

        originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${accessToken}`,
        };

        return apiClient(originalRequest);
    }
);
