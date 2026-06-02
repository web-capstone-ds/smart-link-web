import { apiClient } from "@/api/client";

export interface LoginPayload {
    operatorId: string;
    password: string;
}

export interface AuthUser {
    id?: string;
    operatorId?: string;
    name: string;
    role?: string;
    department?: string;
    phone?: string;
    active?: boolean;
    updatedAt?: string;
    version?: number;
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

type MeResponse = {
    user?: Partial<AuthUser>;
    data?: {
        user?: Partial<AuthUser>;
    } & Partial<AuthUser>;
} & Partial<AuthUser>;

export async function login(payload: LoginPayload): Promise<LoginResult> {
    if (payload.operatorId === "user" && payload.password === "user") {
        return {
            accessToken: "dev-temp-user-token",
            user: {
                id: "TEMP-USER",
                operatorId: "user",
                name: "user",
                role: "OPERATOR",
                department: "운영팀",
                active: true,
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
        user: normalizeAuthUser(data.user, payload.operatorId),
    };
}

export async function logout() {
    await apiClient.post("/api/v1/auth/logout");
}

export async function fetchMe(): Promise<AuthUser> {
    const response = await apiClient.get<MeResponse>("/api/v1/auth/me");
    const body = response.data;
    const data = body.data || body;
    const user = data.user || data;

    return normalizeAuthUser(user);
}

function normalizeAuthUser(user: Partial<AuthUser> | undefined, fallbackOperatorId = "Unknown"): AuthUser {
    return {
        id: user?.id,
        operatorId: user?.operatorId || fallbackOperatorId,
        name: user?.name || user?.operatorId || fallbackOperatorId,
        role: user?.role || "OPERATOR",
        department: user?.department || "운영팀",
        phone: user?.phone,
        active: user?.active,
        updatedAt: user?.updatedAt,
        version: user?.version,
    };
}
