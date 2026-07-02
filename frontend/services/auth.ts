import axios from "axios";
import api from "@/lib/axios";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function csrf() {
    await axios.get(`${BACKEND_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
    });
}

export async function login(data: { email: string; password: string }) {
    await csrf();

    const response = await api.post("/login", data);

    return response.data;
}

export async function logout() {
    const response = await api.post("/logout");

    return response.data;
}

export async function me() {
    const response = await api.get("/me");

    return response.data;
}
