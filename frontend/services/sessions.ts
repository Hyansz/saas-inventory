import api from "@/lib/axios";

export interface ActiveSession {
    id: number;
    name: string;
    username: string;
    email: string | null;
    role: string;
    logged_in_at: string | null;
    last_used_at: string | null;
}

export async function getActiveSessions(): Promise<ActiveSession[]> {
    const response = await api.get("/admin/active-sessions");

    return response.data;
}

export async function forceLogout(userId: number) {
    const response = await api.post(`/admin/force-logout/${userId}`);

    return response.data;
}