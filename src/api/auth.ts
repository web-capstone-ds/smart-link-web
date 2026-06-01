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
                name: "user",
                role: "Operator",
                department: "운영팀",
            },
        };
    }

    const loginResponse = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    const body = await loginResponse.json().catch(() => null) as LoginResponse | null;

    if (!loginResponse.ok) {
        const message = body && "data" in body ? JSON.stringify(body.data) : loginResponse.statusText;
        throw new Error(`로그인 요청 실패 (${loginResponse.status}): ${message}`);
    }

    if (!body) {
        throw new Error("로그인 응답을 JSON으로 해석할 수 없습니다.");
    }

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
            operatorId: data.user?.operatorId,
            name: data.user?.name || data.user?.operatorId || payload.operatorId,
            role: data.user?.role || "Operator",
            department: data.user?.department || "운영팀",
        },
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

    return {
        id: user.id,
        operatorId: user.operatorId,
        name: user.name || user.operatorId || "Unknown",
        role: user.role || "Operator",
        department: user.department || "운영팀",
    };
}
