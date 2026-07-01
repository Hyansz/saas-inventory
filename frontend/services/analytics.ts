import api from "@/lib/axios";

export async function getAnalytics() {
    const res = await api.get("/analytics");

    return res.data;
}