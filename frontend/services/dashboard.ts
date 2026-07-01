import api from "@/lib/axios";

export async function getDashboard() {
    const res = await api.get("/dashboard");

    return res.data;
}
