import api from "@/lib/axios";

export interface ActiveSession {
    token_id: number;
    user_id: number;
    name: string;
    username: string;
    email: string | null;
    role: string;
    ip_address: string;
    device: string;
    browser: string;
    os: string;
    logged_in_at: string | null;
    last_used_at: string | null;
}

export async function getActiveSessions(): Promise<ActiveSession[]> {
    const response = await api.get("/admin/active-sessions");

    return response.data;
}

export async function forceLogoutToken(tokenId: number) {
    const response = await api.delete(
        `/admin/force-logout-token/${tokenId}`,
    );

    return response.data;
}

export async function forceLogout(userId: number) {
    const response = await api.post(`/admin/force-logout/${userId}`);

    return response.data;
}
