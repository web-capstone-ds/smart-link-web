import axios from "axios";

const AUTH_TOKEN_KEYS = ["accessToken", "token", "jwt"];

function getStoredAuthToken() {
    if (typeof window === "undefined") return null;

    for (const key of AUTH_TOKEN_KEYS) {
        const token = window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
        if (token) return token;
    }

    return null;
}

export const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
    const token = getStoredAuthToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
