import api from "@/lib/axios";

export interface ManagedUser {
    id: number;
    name: string;
    username: string;
    email: string | null;
    role: "super_admin" | "admin" | "manager";
    created_at: string;
}

export async function getUsers(): Promise<ManagedUser[]> {
    const response = await api.get("/admin/users");

    return response.data;
}

export async function createUser(data: {
    name: string;
    username: string;
    email?: string;
    password: string;
    role: string;
}) {
    const response = await api.post("/admin/users", data);

    return response.data;
}

export async function updateUser(
    id: number,
    data: {
        name: string;
        username: string;
        email?: string;
        password?: string;
        role: string;
    },
) {
    const response = await api.put(`/admin/users/${id}`, data);

    return response.data;
}

export async function deleteUser(id: number) {
    const response = await api.delete(`/admin/users/${id}`);

    return response.data;
}
