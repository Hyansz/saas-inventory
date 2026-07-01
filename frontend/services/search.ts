import api from "@/lib/axios";

export async function searchGlobal(query: string) {
    const response = await api.get("/search", {
        params: {
            q: query,
        },
    });

    return response.data;
}
