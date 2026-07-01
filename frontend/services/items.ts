import api from "@/lib/axios";

interface GetItemsParams {
    search?: string;
    page?: number;
    limit?: number;
}

export async function getItems({
    search = "",
    page = 1,
    limit = 10,
}: GetItemsParams = {}) {
    const response = await api.get("/items", {
        params: {
            search,
            page,
            limit,
        },
    });

    return response.data;
}

export async function createItem(data: any) {
    const response = await api.post("/items", data);

    return response.data;
}

export async function updateItem(id: number, data: any) {
    const response = await api.put(`/items/${id}`, data);

    return response.data;
}

export async function deleteItem(id: number) {
    const response = await api.delete(`/items/${id}`);

    return response.data;
}
