import api from "@/lib/axios";

export async function getTransactions(params: any = {}) {
    const { data } = await api.get("/transactions", {
        params,
    });

    return data;
}
