import { apiClient } from "@/api/client";

export interface LoginPayload {
    username: string;
    password: string;
}

export interface AuthUser {
    id?: string;
    name: string;
    role?: string;
    department?: string;
}

export interface LoginResult {
    accessToken: string;
    refreshToken?: string;
    user: AuthUser;
}

type LoginResponse = {
    accessToken?: string;
    token?: string;
    refreshToken?: string;
    user?: Partial<AuthUser>;
    data?: {
        accessToken?: string;
        token?: string;
        refreshToken?: string;
        user?: Partial<AuthUser>;
    };
};

export async function login(payload: LoginPayload): Promise<LoginResult> {
    if (payload.username === "user" && payload.password === "user") {
        return {
            accessToken: "dev-temp-user-token",
            user: {
                id: "TEMP-USER",
                name: "user",
                role: "Operator",
                department: "운영팀",
            },
        };
    }

    const response = await apiClient.post<LoginResponse>("/api/v1/auth/login", payload);
    const body = response.data;
    const data = body.data || body;
    const accessToken = data.accessToken || data.token;

    if (!accessToken) {
        throw new Error("로그인 응답에 access token이 없습니다.");
    }

    return {
        accessToken,
        refreshToken: data.refreshToken,
        user: {
            id: data.user?.id,
            name: data.user?.name || payload.username,
            role: data.user?.role || "Operator",
            department: data.user?.department || "운영팀",
        },
    };
}

export async function logout() {
    await apiClient.post("/api/v1/auth/logout");
}
